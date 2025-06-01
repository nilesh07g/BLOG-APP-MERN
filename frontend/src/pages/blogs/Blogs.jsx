import React, { useState } from 'react'
import SearchBlog from './SearchBlog'




const Blogs = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [query, setQuery] = useState({ search: '', category: '' });

    const handleSearchChange = (e) => setSearch(e.target.value);
    const handleSearch = () => setQuery({ search, category });
  return (
    <div>
        <SearchBlog
        search={search}
        handleSearchChange={handleSearchChange}
        handleSearch={handleSearch}
        
      />
        <div>Blog card</div>
    </div>
  )
}

export default Blogs