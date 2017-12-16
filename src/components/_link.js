export default function(json, vis) {
    //曲线
/*  let link = vis.selectAll("path.link");
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
        .attr("fill","none")*/

    //直线
    let link = vis.selectAll("line.link");
    link = link.data(json["links"],d=>(`${d["source"]["id"]}_${d["target"]["id"]}`));
    link.exit().remove();
    link = link.enter()
        .append("svg:line")
        .lower()
        .attr("class", "link")
        .merge(link)
        .attr("id",(d) => (`link-${d["source"]["index"]}_${d["target"]["index"]}`))
        .attr("marker-start",d=>d.source.index===d.target.index ? false :(d["isTwoWay"] ? "url(#start-arrow)" : "") )
        .attr("marker-end",d=>d.source.index===d.target.index ? false :"url(#end-arrow)")
        .attr("stroke", "#5bc0de")
        .attr("stroke-width",0.7)
        .attr("fill","none");
    return link;
    
}