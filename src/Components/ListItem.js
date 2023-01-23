import { useSortable } from '@dnd-kit/sortable'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useThemeContext } from '../context/themeContext'
import { CSS } from '@dnd-kit/utilities';
import gsap from 'gsap'

const check = <i className="fa-solid fa-circle-check"></i>

function ListItem({name, id, completed,handleComplete, removeTodo, grid}) {
    const theme = useThemeContext()

    //refs
    const todoRef = React.useRef()
    const nameRef = React.useRef()

    const {attributes,listeners, setNodeRef, transform, transition } = useSortable({id})

    //dnd styles
    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    //random colours
    const randomColours = [
        theme.buttonGradient1,
        theme.buttonGradient2,
        theme.buttonGradient3,
        theme.buttonGradient4,
        theme.buttonGradient5,
        theme.buttonGradient6,
        theme.buttonGradient7,
        theme.buttonGradient8,
        theme.buttonGradient9,
        theme.buttonGradient10,
        theme.buttonGradient11,
        theme.buttonGradient12,
        theme.buttonGradient13,
        theme.buttonGradient14,
    ]

    //randomizer
    const randomColor = () =>{
        const randomColor = randomColours[Math.floor(Math.random() * randomColours.length)]
        return randomColor;
    }

    //memorize colours
    const randomColorMemo = React.useMemo(() => {
        return randomColor()
    },[])

    //animate on delete
    const animateAndDelete = () =>{
        gsap.to(todoRef.current, {
            duration: 0.5,
            opacity: 0,
            y: -20,
            rotationX: 180,
            onComplete: () => {
                removeTodo(id)
            }
        })
    }

    //animate on complete
    useEffect(() => {
        gsap.from(nameRef.current, {
            duration: 0.5,
            opacity: 0,
            y: 20,
            rotateX:180,
            delay: -0.1,
            onComplete: () =>{
                gsap.to(nameRef.current,{
                    duration: 0.5,
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                })
            }
        })
    }, [completed]);

    return (
        <ListItemStyled theme={theme}grid={grid} completed={completed} randColor={randomColorMemo} style={style} {...attributes} {...listeners} ref={setNodeRef}>
            <li onDoubleClick={animateAndDelete} ref={todoRef}>
                <p ref={nameRef}>
                    {name}
                </p>
            </li>
            <button onDoubleClick={() => handleComplete(id)} className="complete-btn">
                {check}
            </button>
        </ListItemStyled>
    )
}

const ListItemStyled = styled.div`
    background: ${(props) => props.theme.colorBg2};
    position: relative;
    li{
        background: ${(props) => props.randColor};
        padding: 1rem 2rem;
        border-radius: 5px;
        margin-bottom: ${(props) => props.grid ? '0' : '1rem'};
        list-style: none;
        border: 1px solid ${props => props.theme.colorIcons3};
        box-shadow:${props => props.theme.shadow4};
        &:hover{
            cursor: pointer;
        }
        &:active{
            transform: scale(0.98);
        }
        p{
            color: ${props => props.completed ? props.theme.colorPrimaryGreen : props.theme.colorGrey0};
            font-size: clamp(1rem, 2vw, 1.2rem);
            text-decoration: ${props => props.completed ? 'line-through': 'none'};
        }
    }

    .complete-btn{
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        font-size: clamp(1.2rem, 2vw, 2rem);
        padding: .4rem .9rem;
        font-family: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        color: ${props => props.completed ? props.theme.colorPrimaryGreen : props.theme.colorIcons2};
        i{
            box-shadow: 1px 3px 7px rgba(0,0,0, 0.3);
            border-radius: 50%;
        }
    }
`;

export default ListItem