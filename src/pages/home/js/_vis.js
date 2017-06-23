
export default function (){
    let zoom = d3.zoom().scaleExtent([0.2,10]).on("zoom",()=>{_vis.attr("transform", d3.event.transform)});
    let _vis=d3.select("body").append("svg:svg").attr('id','svgView')
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight)
    .call(zoom).on("dblclick.zoom", null)
    .append('g').attr('class','all')/*.attr("transform", "translate(" + window.innerWidth / 2 + "," + window.innerHeight / 2 + ")")*/
    _vis.append("svg:defs").selectAll("marker")
        .data(["end"])
        .enter().append("svg:marker")
        .attr("id","arrow")
        .attr('class','arrow')
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 27)
        .attr("refY", 0)
        .attr("markerWidth", 9)
        .attr("markerHeight", 16)
        .attr("markerUnits","userSpaceOnUse")
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr('fill','#666');
    return _vis;
}