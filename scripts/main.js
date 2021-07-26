"use strict";function ownKeys(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function _objectSpread(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(n),!0).forEach((function(e){_defineProperty(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):ownKeys(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function _defineProperty(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var evt=null,data=null,margin={top:10,right:10,bottom:10,left:10},width=960-margin.left-margin.right,height=500-margin.top-margin.bottom,xScale=d3.scaleLinear().range([0,width]).interpolate(d3.interpolateRound),yScale=d3.scaleLinear().range([height,50]).interpolate(d3.interpolateRound),svg=d3.select("body").on("keydown",(function(t){evt=t})).on("keyup",(function(t){evt=null})).append("svg").attr("width",width+margin.left+margin.right).attr("height",height+margin.top+margin.bottom).attr("id",uuidv4()).attr("class","root-svg").append("g").attr("transform","translate("+margin.left+","+margin.top+")");function uuidv4(){var t=crypto.getRandomValues(new Uint16Array(8)),e=0;return"00-0-4-1-000".replace(/[^-]/g,(function(n){return(t[e++]+65536*n>>n).toString(16).padStart(4,"0")}))}function updateXScaleDomain(){xScale.domain([0,d3.max(data,(function(t){return t.x+t.width}))])}function updateYScaleDomain(){yScale.domain([0,d3.max(data,(function(t){return t.y+t.height}))])}function points(t){return[{x:t.x,y:t.y},{x:t.x+t.width/2,y:t.y+t.height},{x:t.x+t.width,y:t.y}]}function update(t,e,n){svg.append("circle").attr("r",4).attr("cx",e.x-10).attr("cy",e.y-10).attr("fill","red");var r=points(t).map((function(t){return[xScale(t.x),yScale(t.y)]}));data=d3.polygonContains(r,[e.x-10,e.y-10])?d3.map(data,(function(e){return _objectSpread(_objectSpread(_objectSpread({},e),e.id!==t.id&&{tone:t[n]}),e.id===t.id&&_defineProperty({},n,t.tone))})):e.y-10===yScale(t.y)?d3.map(data,(function(e){return _objectSpread(_objectSpread(_objectSpread({},e),e.id!==t.id&&{width:t[n]}),e.id===t.id&&_defineProperty({},n,t.width))})):d3.map(data,(function(e){return _objectSpread(_objectSpread(_objectSpread({},e),e.id!==t.id&&{height:t[n]}),e.id===t.id&&_defineProperty({},n,t.height))})),draw()}function draw(){updateXScaleDomain(),updateYScaleDomain();var t=svg.selectAll(".triangle").data(data,(function(t){return t.id}));t.enter().append("polygon").attr("points",(function(t){return points(t).map((function(t){return[xScale(t.x),yScale(t.y)].join(",")})).join(" ")})).attr("id",(function(t){return t.id})).attr("class","triangle").attr("fill",(function(t){return d3.rgb(t.x,t.y,t.tone)})).attr("stroke-width","2").attr("stroke","black").on("click",(function(t,e){evt&&"x"===evt.key&&update(e,{x:t.x,y:t.y},"x"),evt&&"y"===evt.key&&update(e,{x:t.x,y:t.y},"y")})),t.transition().duration(500).attr("points",(function(t){return points(t).map((function(t){return[xScale(t.x),yScale(t.y)].join(",")})).join(" ")})).attr("fill",(function(t){return d3.rgb(t.x,t.y,t.tone)}))}d3.json("assets/stubs/triangles.json").then((function(t){data=d3.map(t,(function(t){return _objectSpread(_objectSpread({},t),{},{id:uuidv4()})})),draw()}));