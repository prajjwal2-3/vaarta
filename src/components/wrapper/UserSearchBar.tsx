'use client'
import { useState } from "react"
export default function UserSearchBar({usernames}:{usernames:string[]}) {
    const [searchTerm,setSearchTerm]=useState('')
    const [filteredUsers,setFilteredUsers]=useState(usernames)
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredUsers(
          usernames.filter((username) => username.toLowerCase().includes(term))
        );
      };
    
  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <ul className="list-disc pl-5">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((username, index) => (
            <li key={index} className="py-1">
              {username}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No users found</li>
        )}
      </ul>
    </div>
  )
}
