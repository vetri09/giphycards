import React from 'react'
import './posts.css'

export default function Posts({ content, link }) {
    return (
        <div className="post_container">
            <img src={link} alt="" />
            <p>{content}</p>
        </div>
    )
}
