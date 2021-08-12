// init
var evt    = null,
    data   = null,
    border = 5,
    margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width  = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// scale for x-axis
var xScale = d3.scaleLinear().range([0, width]).interpolate(d3.interpolateRound);

// scale for y-axis
var yScale = d3.scaleLinear().range([height, 50]).interpolate(d3.interpolateRound);

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
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
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
 * update xScale domain
 */
function updateXScaleDomain() {
    // update domain
    xScale.domain([0, d3.max(data, function(d) { return d.x + d.width; })]);
}

/**
 * update yScale domain
 */
function updateYScaleDomain() {
    // update domain
    yScale.domain([0, d3.max(data, function(d) { return d.y + d.height; })]);
}

/**
 * return points
 * @param {*} d 
 * @returns 
 */
 function points(d) {
    return [
        {
            x: d.x,
            y: d.y
        },
        {
            x: d.x + (d.width / 2),
            y: d.y + d.height,
        },
        {
            x: d.x + d.width,
            y:d.y
        }
    ];
}

/**
 * update data
 * @param {*} o 
 * @param {*} coordinates 
 * @param {*} prop 
 */
function update(o, coordinates, prop) {
    // base
    if((coordinates.y - 10) >= (yScale(o.y) - border)) {
        data = d3.map(data, function(d) {
            return {
                ...d,
                [prop]: d.width,
                width: d[prop]
            };
        })
    }
    // check if the click is inside
    else {
        data = d3.map(data, function(d) {
            return {
                ...d,
                [prop]: d.tone,
                tone: d[prop]
            };
        });
    }
    // update
    draw();
}

function updateHeight(o, coordinates, prop) {
    data = d3.map(data, function(d) {
        return {
            ...d,
            [prop]: d.height,
            height: d[prop]
        };
    });
    // update
    draw();
}

/**
 * Draw 
 */
function draw() {
    // update domain
    updateXScaleDomain();
    updateYScaleDomain();
    // data join
    let node = svg.selectAll('.node').data(data, function(d) {
        return d.id;
    })
    let nodeEnter = node.enter()
        .append('g')
        .attr('class', 'node');
    // enter clause: add new elements
    nodeEnter.append('polygon')
        .attr('points', function(d) { 
            return points(d).map(
                function(d) {
                    return [xScale(d.x), yScale(d.y)].join(',');
                }
            ).join(' ');
        })
        .attr('id', function(d) { return d.id; })
        .attr('class', 'triangle')
        .attr('fill', function(d) { return d3.rgb(d.x, d.y, d.tone); })
        .attr('stroke-width', border)
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
        })
    //
    nodeEnter.append('path')
        .attr('d', function(d) {
            return 'M ' + xScale(d.x + d.width/2) + ' ' + yScale(d.y) +
                ' L' + xScale(d.x + d.width/2) + ' ' + yScale(d.y + d.height) +
                ' z'
            }
        )
        .attr('class', 'triangle-height')
        .style('stroke', 'black')
        .style('stroke-dasharray', '10')
        .style('stroke-width', border)
        .on('click', function(d, i) {
            // update svg if the event is x or y
            if(evt && (evt.key === 'x' || evt.key === 'y')) {
                updateHeight(i, { x: d.x, y: d.y }, evt.key);
            }
        });
    // enter + update clause
    node.select('polygon')
        .transition()
        .duration(500)
        .attr('points', function(d) {
            return points(d).map(
                function(d) {
                    return [xScale(d.x), yScale(d.y)].join(',');
                }
            ).join(' ');
        })
        .attr('fill', function(d) { return d3.rgb(d.x, d.y, d.tone); });
    // enter + update clause
    node.select('path')
        .transition()
        .duration(500)
        .attr('d', function(d) {
            return 'M ' + xScale(d.x + d.width/2) + ' ' + yScale(d.y) +
                ' L' + xScale(d.x + d.width/2) + ' ' + yScale(d.y + d.height) +
                ' z'
            }
        );
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
