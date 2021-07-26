// init
var evt    = null,
    data   = null,
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
    // append point
    svg.append('circle')
        .attr('r', 4)
        .attr('cx', coordinates.x - 10)
        .attr('cy', coordinates.y - 10)
        .attr('fill', 'red');
    // get polygon
    var polygon = points(o).map(
        function(d) {
            return [xScale(d.x), yScale(d.y)];
        }
    );
    // check if the click is inside
    if(d3.polygonContains(polygon, [coordinates.x - 10, coordinates.y - 10])) {
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
        if((coordinates.y - 10) === yScale(o.y)) {
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
    // update domain
    updateXScaleDomain();
    updateYScaleDomain();
    // data join
    let triangles = svg.selectAll('.triangle').data(data, function(d) {
        return d.id;
    });
    // enter clause: add new elements
    triangles.enter()
        .append('polygon')
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
        .attr('points', function(d) {
            return points(d).map(
                function(d) {
                    return [xScale(d.x), yScale(d.y)].join(',');
                }
            ).join(' ');
        })
        .attr('fill', function(d) { return d3.rgb(d.x, d.y, d.tone); });
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
