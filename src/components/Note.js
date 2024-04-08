import React, { forwardRef } from 'react'

const Note = forwardRef(({
  content, 
  initialPosition,
  ...props
}, ref) => {
return (
  <div 
  ref={ref}
  style={{
      position: "absolute",
      left: `${initialPosition?.x}px`,
      top: `${initialPosition?.y}px`,
      padding: "20px",
      userSelect: "none",
      cursor: "move",
      border: "1px solid #666",
      backgroundColor: "yellow"
  }} 
  {...props}>📌{content}</div>
)
}) 


export default Note