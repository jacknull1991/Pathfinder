import React from 'react'
import * as sortingAlgorithms from '../algorithms/sortingAlgorithms'
import Button from '../components/button'
import Slider from '../components/slider'
import './sorter.css'

// animation speed in ms
const ANIMATION_SPEED = 3;

// max bar height
const MAX_BAR_HEIGHT = 1000;

// user defined array size
const ARRAY_SIZE = 100;
const MAX_SIZE = 200;
const MIN_SIZE = 10;

export default class SortingAnimation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: [],
            size: ARRAY_SIZE,
        };

        this.changeArraySize = this.changeArraySize.bind(this);
    }

    // called when it loads
    componentDidMount() {
        this.resetArray();
    }

    // randomly generate new array
    resetArray() {
        const array = [];
        const size = this.state.size;
        const max_height = Math.min(MAX_BAR_HEIGHT, document.getElementsByClassName('array-container')[0].clientHeight - 10);
        for (let i = 0; i < size; i++) {
            array.push(randomIntFromInterval(10, max_height));
        }
        this.setState({array: array, size: size});
    }

    // change array range
    changeArraySize(size) {
        this.setState({size: size}, () => this.resetArray());
    }

    // test sorting algorithm for 100 iterations
    testSort() {
        for (let i = 0; i < 100; i++) {
            const array = [];
            const len = randomIntFromInterval(1, 1000);
            for (let j = 0; j < len; j++) {
                array.push(randomIntFromInterval(-1000, 1000));
            }
            const javaScriptSorted = this.state.array.slice().sort((a, b) => a - b);
            const sorted = sortingAlgorithms.heapSort(this.state.array);
            if (!arraysEqual(javaScriptSorted, sorted)) {
                console.log(javaScriptSorted);
                console.log(sorted);
                break;
            }
            console.log(arraysEqual(javaScriptSorted, sorted));
        }
    }

    mergeSort() {
        const animations = sortingAlgorithms.mergeSort(this.state.array);
        for (let i = 0; i < animations.length; i++) {
            const arrayBars = document.getElementsByClassName('array-bar');
            const colorChange = i % 3 !== 2;
            // change color
            if (colorChange) {
                const [idx1, idx2] = animations[i];
                const style1 = arrayBars[idx1].style;
                const style2 = arrayBars[idx2].style;
                const color = i % 3 === 0 ? 'cyan' : 'pink';
                setTimeout(() => {
                    style1.backgroundColor = color;
                    style2.backgroundColor = color;
                }, i * ANIMATION_SPEED);
            } else {
            // change bar height
                const [idx, height] = animations[i];
                setTimeout(() => {
                    arrayBars[idx].style.height = `${height}px`;
                }, i * ANIMATION_SPEED);
            }
        }
    }

    quickSort() {
        const animations = sortingAlgorithms.quickSort(this.state.array);
        let count = 0;
        for (let i = 0; i < animations.length; i++) {
            for (let j = 0; j < animations[i].length; j++) {
                const arrayBars = document.getElementsByClassName('array-bar');
                if (j === 0) { // mark pivot red
                    const pivot = animations[i][j][0];
                    setTimeout(() => {
                        arrayBars[pivot].style.backgroundColor = 'red';
                    }, count * ANIMATION_SPEED);
                } else if (j === animations[i].length - 1) { // swap pivot to correct position
                    const [idx1, idx2, height1, height2] = animations[i][j];
                    const style1 = arrayBars[idx1].style;
                    const style2 = arrayBars[idx2].style;
                    setTimeout(() => {
                        style1.backgroundColor = 'pink';
                        style2.backgroundColor = 'pink';
                        style1.height = `${height2}px`;
                        style2.height = `${height1}px`;
                    }, count * ANIMATION_SPEED);
                } else { // partitioning
                    const [idx1, idx2, height1, height2] = animations[i][j];
                    const style1 = arrayBars[idx1].style;
                    const style2 = arrayBars[idx2].style;
                    setTimeout(() => {
                        style1.backgroundColor = j % 2 === 1 ? 'greenyellow' : 'pink';
                        style2.backgroundColor = j % 2 === 1 ? 'cyan' : 'pink';
                        if (j % 2 === 0 && height1 !== -1) {
                            style1.height = `${height2}px`;
                            style2.height = `${height1}px`;
                        }
                    }, count * ANIMATION_SPEED);
                }

                count++;
            }
        }
    }

    heapSort() {
        const animations = sortingAlgorithms.heapSort(this.state.array);
        for (let i = 0; i < animations.length; i++) {
            const arrayBars = document.getElementsByClassName('array-bar');
            const [idx1, idx2, height1, height2] = animations[i];
            const isCompare = height1 === -1 ? 1 : 0;
            const style1 = arrayBars[idx1].style;
            const style2 = arrayBars[idx2].style;
            setTimeout(() => {
                style1.backgroundColor = isCompare ? 'cyan' : 'pink';
                style2.backgroundColor = isCompare ? 'cyan' : 'pink';
                if (!isCompare) {
                    style1.height = `${height2}px`;
                    style2.height = `${height1}px`;
                }
            }, i * ANIMATION_SPEED);
            
        }
    }

    bubbleSort() {
        const animations = sortingAlgorithms.bubbleSort(this.state.array);
        for (let i = 0; i < animations.length; i++) {
            const arrayBars = document.getElementsByClassName('array-bar');
            const isCompare = i % 2 === 0;
            const [idx1, idx2, height1, height2] = animations[i];
            const style1 = arrayBars[idx1].style;
            const style2 = arrayBars[idx2].style;
            setTimeout(() => {
                style1.backgroundColor = isCompare ? 'greenyellow' : 'pink';
                style2.backgroundColor = isCompare ? 'cyan' : 'pink';
                if (!isCompare && height1 !== -1) {
                    style1.height = `${height2}px`;
                    style2.height = `${height1}px`;
                }
            }, i * ANIMATION_SPEED);
            
        }
    }

    selectionSort() {
        const animations = sortingAlgorithms.selectionSort(this.state.array);
        for (let i = 0; i < animations.length; i++) {
            const arrayBars = document.getElementsByClassName('array-bar');
            const isCompare = i % 2 === 0;
            const [idx1, idx2, height1, height2] = animations[i];
            const style1 = arrayBars[idx1].style;
            const style2 = arrayBars[idx2].style;
            setTimeout(() => {
                style1.backgroundColor = isCompare ? 'red' : 'pink';
                style2.backgroundColor = isCompare ? 'cyan' : 'pink';
                if (!isCompare && height1 !== -1) {
                    style1.height = `${height2}px`;
                    style2.height = `${height1}px`;
                }
            }, i * ANIMATION_SPEED);
        }
    }

    cocktailSort() {
        const animations = sortingAlgorithms.cocktailSort(this.state.array);
        for (let i = 0; i < animations.length; i++) {
            const arrayBars = document.getElementsByClassName('array-bar');
            const isCompare = i % 2 === 0;
            const [idx1, idx2, height1, height2] = animations[i];
            const style1 = arrayBars[idx1].style;
            const style2 = arrayBars[idx2].style;
            setTimeout(() => {
                style1.backgroundColor = isCompare ? 'greenyellow' : 'pink';
                style2.backgroundColor = isCompare ? 'cyan' : 'pink';
                if (!isCompare && height1 !== -1) {
                    style1.height = `${height2}px`;
                    style2.height = `${height1}px`;
                }
            }, i * ANIMATION_SPEED);
        }
    }

    render() {
        const {array, size} = this.state;

        return (
            <>
            <div className="control-container">
                <p>Sorting Animation</p>
                {/* <div className="custom-select">
                    <select>
                        <option value="0">Select Algorithm</option>
                        <option value="1">Merge Sort</option>
                        <option value="2">Quick Sort</option>
                        <option value="3">Heap Sort</option>
                        <option value="4">Bubble Sort</option>
                    </select>
                </div> */}
                <div className="button-wrapper">
                    <Button text="New Array" onClick={() => this.resetArray()}/>
                    <Button text="Merge Sort" onClick={() => this.mergeSort()}/>
                    <Button text="Quick Sort" onClick={() => this.quickSort()}/> 
                    <Button text="Heap Sort" onClick={() => this.heapSort()}/>
                    <Button text="Bubble Sort" onClick={() => this.bubbleSort()}/>
                    <Button text="Selection Sort" onClick={() => this.selectionSort()}/>
                    <Button text="Cocktail Sort" onClick={() => this.cocktailSort()}/>
                </div>
                {/* <button onClick={() => this.testSort()}> Test Sort </button> */}
                <div className="slider-wrapper">   
                    <Slider text="Array Size" min={MIN_SIZE} max={MAX_SIZE} value={size} onChange={this.changeArraySize}></Slider>
                </div>
                {/* <input type="range" min="10" max="200" className="slider" defaultValue="100" onChange={(e) => this.changeArray(e)}></input> */}
            </div>
            <div className="array-container">
                {array.map((value, index) => (
                    <div className="array-bar" key={index} style={{height: `${value}px`}}>
                    </div>
                ))}
            </div>
            </>
        )
    }
}

// random number generator inclusive
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// checks if two arrays are equal
function arraysEqual(first, second) {
    if (first.length !== second.length) return false;
    for (let i = 0; i < first.length; i++) {
        if (first[i] !== second[i]) return false;
    }
    return true;
}


