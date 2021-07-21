// init
var evt    = null,
    data   = null,
    margin = { top: 10, right: 10, bottom: 10, left: 10 };

// create svg
var svg = d3.select('body')
    .on('keydown', function(k) {
        // set keyword event
        evt = k;
    })
    .on('keyup', function(k) {
        // reset keyword event
        evt = null;
    })
    .append('svg')
    .attr('id', uuidv4())
    .attr('class', 'root-svg')
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

/**
 * create uuid
 * @returns {string}
 */
function uuidv4() {
    const a = crypto.getRandomValues(new Uint16Array(8));
    let i = 0;
    return '00-0-4-1-000'.replace(/[^-]/g, s => (a[i++] + s * 0x10000 >> s).toString(16).padStart(4, '0'));
}

/**
 * update data
 * https://stackoverflow.com/a/47723459/3751473
 * @param {*} ax 
 * @param {*} ay 
 * @param {*} bx 
 * @param {*} by 
 * @param {*} cx 
 * @param {*} cy 
 * @param {*} x 
 * @param {*} y 
 * @returns {boolean}
 */
function triangleContains(ax, ay, bx, by, cx, cy, x, y) {
    let det = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
	
    return  det * ((bx - ax) * (y - ay) - (by - ay) * (x - ax)) > 0 &&
            det * ((cx - bx) * (y - by) - (cy - by) * (x - bx)) > 0 &&
            det * ((ax - cx) * (y - cy) - (ay - cy) * (x - cx)) > 0;
}

/**
 * 
 * @param {*} o 
 * @param {*} coordinates 
 * @param {*} prop 
 */
function update(o, coordinates, prop) {
    // init points triangle
    var ax = o.x, 
        ay = o.y,
        bx = o.x + (o.width / 2),
        by = o.y + o.height,
        cx = o.x - (o.width / 2),
        cy = o.y + o.height;
    // check if the click is inside
    if(triangleContains(ax, ay, bx, by, cx, cy, coordinates.x, coordinates.y)) {
        // the clicked point is internal so update the color
        data = d3.map(data, function(d) {
            return {
                ...d,
                ...(d.id !== o.id && { tone: o[prop] }),
                ...(d.id === o.id && { [prop]: o.tone })
            };
        });
    }
    else {
        // base
        if(coordinates.y === (o.y + o.height)) {
            data = d3.map(data, function(d) {
                return {
                    ...d,
                    ...(d.id !== o.id && { width: o[prop] }),
                    ...(d.id === o.id && { [prop]: o.width })
                };
            })
        }
        // left or right side
        else {
            data = d3.map(data, function(d) {
                return {
                    ...d,
                    ...(d.id !== o.id && { height: o[prop] }),
                    ...(d.id === o.id && { [prop]: o.height })
                };
            })
        }
    }
    // update
    draw();
}

/**
 * Draw 
 */
function draw() {
    // data join
    var triangles = svg.selectAll('.triangle').data(data, function(d) {
        return d.id;
    });
    // enter clause: add new elements
    triangles.enter().append('path')  
        .attr('class', 'triangle')
        .attr('d', function(d) {
            return 'M ' + d.x + ' ' + d.y + ' l ' + (d.width / 2) + ' ' + d.height + ' l -' + d.width + ' 0 z';
        })
        .attr('fill', function(d){ return d3.rgb(d.x, d.y, d.tone); })
        .attr('stroke-width', '2')
        .attr('stroke', 'black')
        .on('click', function(d, i) {
            // update svg if the event is x
            if(evt && evt.key === 'x') {
                update(i, { x: d.x, y: d.y }, 'x');
            }
            // update svg if the event is y
            if(evt && evt.key === 'y') {
                update(i, { x: d.x, y: d.y }, 'y');
            }
        });
    // enter + update clause
    triangles.transition()
        .duration(500)
        .attr('d', function(d) {
            return 'M ' + d.x + ' ' + d.y + ' l ' + (d.width / 2) + ' ' + d.height + ' l -' + d.width + ' 0 z';
        })
        .attr('fill', function(d){ return d3.rgb(d.x, d.y, d.tone); });
}

// get data-cases
d3.json('assets/stubs/triangles.json').then(
    function(res) {
        // add id for each data-case
        data = d3.map(res, function(d) { 
            return {
                ...d,
                id: uuidv4()
            }; 
        });
        // start
        draw();
    }
);