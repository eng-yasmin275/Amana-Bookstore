'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Book } from '../types';
import BookCard from './BookCard';
import BookListItem from './BookListItem';
import Pagination from './Pagination';

interface BookGridProps {
  books?: Book[];
  onAddToCart?: (bookId: string) => void;
}

const BookGrid: React.FC<BookGridProps> = ({ books = [], onAddToCart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [featuredCarouselIndex, setFeaturedCarouselIndex] = useState(0);

  const featuredBooks = useMemo(() => books.filter((book) => book.featured), [books]);
  const booksPerPage = 4;
  const totalFeaturedPages = Math.ceil(featuredBooks.length / booksPerPage);

  const currentFeaturedBooks = useMemo(() => {
    const startIndex = featuredCarouselIndex * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    return featuredBooks.slice(startIndex, endIndex);
  }, [featuredBooks, featuredCarouselIndex]);

  const genres = useMemo(() => {
    const allGenres = books.flatMap((book) => book.genre);
    return ['All', ...new Set(allGenres)];
  }, [books]);

  const filteredAndSortedBooks = useMemo(() => {
    const filtered = books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === 'All' || book.genre.includes(selectedGenre);
      return matchesSearch && matchesGenre;
    });

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'author':
          comparison = a.author.localeCompare(b.author);
          break;
        case 'datePublished':
          comparison =
            new Date(a.datePublished).getTime() - new Date(b.datePublished).getTime();
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'reviewCount':
          comparison = a.reviewCount - b.reviewCount;
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [books, searchQuery, selectedGenre, sortBy, sortOrder]);

  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedBooks.slice(startIndex, endIndex);
  }, [filteredAndSortedBooks, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedBooks.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, sortBy, sortOrder, itemsPerPage]);

  if (!books || books.length === 0) {
    return <p className="text-center text-gray-500">Loading books...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 🔍 Filters and Sorting */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by title or author"
          className="border p-2 rounded w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="reviewCount">Reviews</option>
        </select>
      </div>

      {/* 🏆 Featured Books Carousel */}
      {featuredBooks.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-center text-green-700">Featured Books</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {currentFeaturedBooks.map((book) => (
              <BookCard key={book.id} book={book} onAddToCart={onAddToCart} />
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            <button onClick={() => setFeaturedCarouselIndex((i) => (i === 0 ? totalFeaturedPages - 1 : i - 1))} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Previous</button>
            <button onClick={() => setFeaturedCarouselIndex((i) => (i === totalFeaturedPages - 1 ? 0 : i + 1))} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Next</button>
          </div>
        </section>
      )}

      {/* 📚 All Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {paginatedBooks.map((book) => (
          <BookCard key={book.id} book={book} onAddToCart={onAddToCart} />
        ))}
      </div>

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
         <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  itemsPerPage={itemsPerPage}
  totalItems={filteredAndSortedBooks.length}
/>
        </div>
      )}
    </div>
  );
};

export default BookGrid;
