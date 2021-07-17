/**
 * 
 * @returns {string}
 */
function uuidv4() {
    const a = crypto.getRandomValues(new Uint16Array(8));
    let i = 0;
    return '00-0-4-1-000'.replace(/[^-]/g, s => (a[i++] + s * 0x10000 >> s).toString(16).padStart(4, '0'));
}

/**
 * 
 * @param {*} data 
 * @param {*} coordinates 
 */
function update(data, coordinates) {

}

/**
 * Init 
 * @param {*} data 
 */
function init(data) {
    // init keyword event
    var evt = null;
    // create main svg element
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
        .attr('width', window.innerWidth)
        .attr('height', window.innerHeight)
        .attr('id', uuidv4());

    // create isosceles triangle by dataset
    svg.append('g')
        .selectAll('triangle')
        .data(data)
        .enter()
        .append('path')
        .attr('d', function(d) {
            return 'M ' + d.x + ' ' + d.y + ' l ' + (d.width / 2) + ' ' + d.height + ' l -' + d.width + ' 0 z';
        })
        .attr('fill', function(d) { return d.tone; })
        .attr('stroke-width', '3')
        .attr('stroke', 'black')
        .on('click', function(d, i) {
            // update svg if the event is x
            if(evt && evt.key === 'x') {
                update(data, { x: d.x, y: d.y });
            }
            // update svg if the event is y
            if(evt && evt.key === 'y') {
                update(data, { x: d.x, y: d.y });
            }
        });
}

d3.json('/assets/stubs/triangles.json').then(
    function(data){
        init(data);
    }
);
