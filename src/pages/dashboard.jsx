import React from 'react';
import './dashboard.css';
import Card from '../components/card';

export default function Dashboard(props) {

    return (
        <div className="dashboard-container">
            <Card
                title="PATHFINDING" 
                path="/pathfinder"
                text="Explore several widely used path finding algorithms: Dijkstra, Breadth-first Search, and more!"/>
            
            <Card
                title="SORTING" 
                path="/sorter"
                text="Visualize common comparison based sorting algorithms in action. Who doesn't like sorting?"/>

            <Card
                title="TREE" 
                path="/"
                text="Under development..."/>
        </div>
    )
}