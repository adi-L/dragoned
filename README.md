# Dragoned

## Dragoned.js is a library for drag-and-drop lists with different sizes of height

### Features

- Supports touch devices with touch events.
- Can drag from one list to another.
- Smart auto-scrolling on any device.
- Easy to set up, plug & play!

### Examples

- [Drag And Drop - Sandbox](https://codesandbox.io/s/h22hl?file=/src/index.js)
- [Sortable - Sandbox](https://codesandbox.io/s/youthful-leftpad-b39ps?file=/index.html)
- [All from codesandbox.io](https://codesandbox.io/examples/package/dragoned)

### Install

You can install it on npm.

```text
npm install dragoned --save
```

### Usage

```html
<ul id="container">
  <li>item 1</li>
  <li>item 2</li>
  <li>item 3</li>
</ul>
```

```js
new Dragoned(document.querySelector("#container"));
```

### Options

```js
 new Dragoned(container,{
     group:"group-name",
     sort: true,
     draggable:"query-selector", // which element inside the container should be draggable.
     handle:"handle-element", //  Drag handle selector within list items.
     clone:true, // Clone the item.
     delay: 100 // time in milliseconds to start.
     onStart:({item, from, oldIndex})=>{

     },
     // on move an item in the list or between lists
     onMove:({item, from, to, newIndex, oldIndex})=>{

     },
     // on dragging ended
     onEnd:({item, from, to, newIndex, oldIndex,direction})=>{

     },
     // on creating a clone of element
     onClone:({item, from, oldIndex}) =>{

     }
 });
```

## Contributing

All contributions are super welcome!

[Got questions? click here.](mailto:adilev3344@gmail.com)
