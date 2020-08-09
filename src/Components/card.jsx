import React from 'react';
import './card.css';
import { Link } from 'react-router-dom';

export default function Card(props) {

    return (
        <div className="card">
            <div className="card-image">
            </div>
            <div className="card-content">
                <h2>{props.title}</h2>
                <p>{props.text}
                </p>
                <Link className="card-link" to={props.path}>LET'S GO!</Link>
            </div>
        </div>
    )
}