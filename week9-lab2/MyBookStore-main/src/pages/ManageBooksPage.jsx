import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/outline';


const ManageBooksPage = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const booksPerPage = 12;

    // Auth check
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [navigate]);

    // Fetch books
    const fetchBooks = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8080/api/v1/books');
            if (!res.ok) throw new Error('Failed to fetch books');
            const data = await res.json();
            setBooks(data);
            setFilteredBooks(data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (!term) return setFilteredBooks(books);
        const f = books.filter(b =>
            `${b.title} ${b.author}`.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredBooks(f);
        setCurrentPage(1);
    };

    const handleDelete = async (id) => {
        if (!confirm('คุณแน่ใจหรือไม่ว่าจะลบหนังสือเล่มนี้?')) return;
        try {
            const res = await fetch(`http://localhost:8080/api/v1/books/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            // Refresh
            fetchBooks();
        } catch (err) {
            alert('ลบไม่สำเร็จ: ' + err.message);
        }
    };

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">จัดการหนังสือ</h1>
                        <p className="text-gray-600">จัดการหนังสือในระบบ (เพิ่ม/แก้ไข/ลบ)</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="ค้นหาชื่อหรือผู้แต่ง..."
                            className="px-4 py-2 border rounded-lg mr-3"
                        />
                        <button
                            onClick={() => navigate('/store-manager/add-book')}
                            className="flex items-center gap-2 bg-viridian-600 text-white px-4 py-2 rounded-lg hover:bg-viridian-700"
                        >
                            <PlusIcon className="h-5 w-5" />
                            เพิ่มหนังสือ
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 text-red-600">เกิดข้อผิดพลาด: {error}</div>
                )}

                {/* Simple table/list for management */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ชื่อ</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ผู้แต่ง</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ราคา</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">หมวดหมู่</th>
                                <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y">
                            {currentBooks.map(book => (
                                <tr key={book.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{book.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{book.author}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{book.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{book.category || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        <button
                                            onClick={() => navigate(`/store-manager/add-book?edit=${book.id}`)}
                                            className="inline-flex items-center px-2 py-1 bg-white border rounded-md mr-2 hover:bg-gray-50"
                                        >
                                            <PencilIcon className="h-4 w-4 text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(book.id)}
                                            className="inline-flex items-center px-2 py-1 bg-white border rounded-md hover:bg-gray-50"
                                        >
                                            <TrashIcon className="h-4 w-4 text-red-600" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                        <nav className="flex items-center space-x-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-1 border rounded">ก่อนหน้า</button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} onClick={() => setCurrentPage(i+1)} className={`px-3 py-1 border rounded ${currentPage===i+1? 'bg-viridian-600 text-white':''}`}>{i+1}</button>
                            ))}
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1 border rounded">ถัดไป</button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBooksPage;
