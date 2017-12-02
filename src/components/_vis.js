export default function() {

    let [width, height] = [$(".graph-area").width(), $(".graph-area").height()];

    d3.select('.graph-area').select("*").remove();

    let zoom = d3.zoom()
        .scaleExtent([0.01, 10])
        .on("zoom", () => { vis.attr("transform", () => (d3.event.transform)) });

    let vis = d3.select('.graph-area')
        .append("svg:svg")
        .attr("id", "J_SvgView")
        .attr("width", width)
        .attr("height", height)
        .call(zoom)
        .on("dblclick.zoom", null) 
        .append("svg:g")
        .attr('class', "all")
        .attr("data-width", width)
        .attr("data-height", height)
        

    let arrow = vis.append("svg:defs")
        .selectAll("marker")

    arrow.data(["start-arrow"]).enter().append("svg:marker")
        .attr("id", d=>d)
        .attr('class', 'arrow')
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", -7)
        .attr("refY", 0)
        .attr("markerWidth", 10)
        .attr("markerHeight", 16)
        .attr("markerUnits", "userSpaceOnUse")
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,0L10,5L10,-5")
        .attr('fill', '#666');    

    arrow.data(["end-arrow"]).enter().append("svg:marker")
        .attr("id", d=>d)
        .attr('class', 'arrow')
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 17)
        .attr("refY", 0)
        .attr("markerWidth", 10)
        .attr("markerHeight", 16)
        .attr("markerUnits", "userSpaceOnUse")
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr('fill', '#666');
  
    return vis;
}