export default function(json, vis) {
    let linetext = vis.selectAll('.linetext');
    linetext = linetext.data(json.links);
    linetext.exit().remove();
    linetext = linetext.enter()
        .append("text")
        .attr("class", "linetext")
        .merge(linetext)
/*    linetext.selectAll('textPath').remove();
    linetext.append('svg:textPath')*/
        .attr("startOffset", "50%")
        .attr("text-anchor", "middle")
        .attr("xlink:href", (d) => (d.source.index === d.target.index ? false : `#link-${d.source.index}_${d.target.index}`))
        .text(d=>d["relation"])
        .attr('fill', '#5bc0de');
    return linetext;

}