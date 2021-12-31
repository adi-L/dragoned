# Dragoned

### Dragoned.js is a library for drag-and-drop lists with diffrent sizes of height

# Features

- Supports touch devices with touch events.
- Can drag from one list to another.
- Smart auto-scrolling on any device.
- Easy to set up, plug & play!

# Install

You can install it on npm.

```
npm install dragoned --save
```

# Usage

```
<ul id="container">
 <li>item 1</li>
 <li>item 2</li>
 <li>item 3</li>
</ul>
```

```
 new Dragoned(document.querySelector('#container'));
```

# Options

```
 new Dragoned(container,{
     group:"group-name",
     sort: true,
     draggable:"query-selector", // which element inside the container should br braggable.
     handle:"handle-element", //  Drag handle selector within list items .
     clone:true,
     onStart:()=>{

     },
     onMove:()=>{

     },
     onEnd:()=>{

     }
 });
```
