import nodeIcon from "../images/node.png";
export default function(json, vis) {
    let colors = d3.schemeCategory10,
        groupMap = {};
    let groups = [...new Set(json.nodes.reduce((prev, cur) => (prev.concat(cur.group)), []))]
    groups.forEach((groupItem, groupIdx) => { groupMap[groupItem] = colors[groupIdx] });
    let node = vis.selectAll("g.node");
    node = node.data(json["nodes"], d => (d["id"]));
    node.exit().remove();
    node = node.enter()
        .append("svg:g")
        .attr("class", d=>(d["isNew"] ? "node new-node" : "node"))
        .attr("id", d => ("node-" + d["id"]))
        .merge(node);
        
    node.selectAll(".node-bg").remove();    
    node.selectAll(".node-icon").remove();
    node.selectAll(".node-name").remove();
    node.selectAll(".node-group").remove();
        
    node.append('svg:circle')
        .attr("class","node-bg")
        .attr("r", "12px")
        .attr("fill", "#5bc0de");
    node.append("svg:image")
        .attr("class", "node-icon")
        .attr("xlink:href", nodeIcon)
        .attr("x", "-10px")
        .attr("y", "-10px")
        .attr("width", "20px")
        .attr("height", "20px");
    node.append("svg:text")
        .attr("class", "node-name")
        .attr("dy", "25px")
        .attr("text-anchor", "middle")
        .attr("fill", "#5bc0de")
        .text(d => (d["id"]));
    node.append("svg:text")
        .attr("class", "node-group")
        .attr("dy", d => (d["id"] ? "40px" : "25px"))
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#286090")
        .html(d => d["group"].length ? ("【" + d["group"].reduce((prev, cur) => (`${prev}<tspan fill=${groupMap[cur]}>${cur}</tspan>` + " "), "") + "】").replace(/\s+】/, "】") : "");

    return node;

}