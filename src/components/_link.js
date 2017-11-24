export default function(json, vis) {

    let link = vis.selectAll("path.link");
    link = link.data(json["links"], (d) => (`${d["source"]["id"]}_${d["target"]["id"]}`));
    link.exit().remove();
    link = link.enter()
        .append("svg:path")
        .lower()
        .attr("class", "link")
        .merge(link)
        .attr("marker-end",d=>d.source.index===d.target.index ? false :"url(#end)")
        .attr("stroke", "#204d74")
        .attr("stroke-width",0.3)
        .attr("fill","none")
    return link;
    
}