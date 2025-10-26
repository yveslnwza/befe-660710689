-- Init SQL for week13-lab6
-- Creates tables and seeds basic data (users, roles, permissions, books)

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Roles
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User-Roles
CREATE TABLE IF NOT EXISTS user_roles (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INTEGER,
    PRIMARY KEY (user_id, role_id)
);

-- Permissions
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role-Permissions
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

-- Refresh tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP,
    replaced_by VARCHAR(500)
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(50),
    resource_id VARCHAR(50),
    details JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(50),
    year INTEGER,
    price NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed roles
INSERT INTO roles (name, description, is_system) VALUES
('admin', 'Administrator with full system access', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO roles (name, description, is_system) VALUES
('editor', 'Can create and edit content', false)
ON CONFLICT (name) DO NOTHING;

INSERT INTO roles (name, description, is_system) VALUES
('viewer', 'Read-only access', false)
ON CONFLICT (name) DO NOTHING;

INSERT INTO roles (name, description, is_system) VALUES
('user', 'Default role for new users', true)
ON CONFLICT (name) DO NOTHING;

-- Seed users (password hashes generated with bcrypt cost=12)
-- admin: admin123
-- editor: editor123
-- user: user123
INSERT INTO users (username, email, password_hash, email_verified)
VALUES
('admin', 'admin@bookstore.com', '$2a$12$3BPX09K0yJaNPqOu0d.HMeHz4W7bC8rU3CMufkR2yQ9RHX4RUhA9y', true)
ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, email, password_hash, email_verified)
VALUES
('poohkan', 'editor@bookstore.com', '$2a$12$1nPcjMzNeowC8RxIUggxruqvUVFEhQawl2bEu4dRNZ4RILQD7wX9q', true)
ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, email, password_hash, email_verified)
VALUES
('nuttachot', 'user@bookstore.com', '$2a$12$BMF2D4vNPNXHQZ6IGRKAaePuzhhAsxHVRexuoHt2./cwVQfV36aPG', true)
ON CONFLICT (username) DO NOTHING;

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'admin' AND r.name = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'poohkan' AND r.name = 'editor'
ON CONFLICT (user_id, role_id) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r WHERE u.username = 'nuttachot' AND r.name = 'user'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Seed one sample book
INSERT INTO books (title, author, isbn, year, price)
VALUES ('The Go Programming Language', 'Alan Donovan', '978-0134190440', 2015, 650.00)
ON CONFLICT DO NOTHING;

-- Done
-- เพิ่ม permission books:read ถ้ายังไม่มี
INSERT INTO permissions (name, description, resource, action)
VALUES ('books:read', 'Read all books', 'books', 'read')
ON CONFLICT (name) DO NOTHING;

-- ให้ role admin ได้สิทธิ์ books:read
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'admin' AND p.name = 'books:read'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- เพิ่ม permission books:create ถ้ายังไม่มี
INSERT INTO permissions (name, description, resource, action)
VALUES ('books:create', 'Create new books', 'books', 'create')
ON CONFLICT (name) DO NOTHING;

-- ให้ role admin ได้สิทธิ์ books:create
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'admin' AND p.name = 'books:create'
ON CONFLICT (role_id, permission_id) DO NOTHING;