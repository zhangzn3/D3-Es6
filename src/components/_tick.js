const arcPath = function(leftHand, d) {
    let start = leftHand ? d.source : d.target,
        end = leftHand ? d.target : d.source,
        dx = end.x - start.x,
        dy = end.y - start.y,
        dr = Math.sqrt(dx * dx + dy * dy),
        sweep = leftHand ? 0 : 1;
    return "M" + start.x + "," + start.y + "A" + dr + "," + dr +
        " 0 0," + sweep + " " + end.x + "," + end.y;
};

export default function tick(link,node,linetext) {
    //曲线
/*    //连接线显示的位置
    link.attr("d", (d) => (arcPath(true, d)));
    //关系文字显示的位置
    linetext.attr("d", (d) => (arcPath(d.source.x < d.target.x, d)));*/

    //直线
    //连接线显示的位置
    link.attr("x1", (d) => (d["source"]["x"]))
    .attr("y1", (d) => (d["source"]["y"]))
    .attr("x2", (d) => (d["target"]["x"]))
    .attr("y2", (d) => (d["target"]["y"]));

    //关系文字显示的位置
    linetext.attr("x", (d) => ((d["source"]["x"]+d["target"]["x"])/2))
    .attr("y", (d) => ((d["source"]["y"]+d["target"]["y"])/2));

    //节点显示的位置
    node.attr("transform", (d) => ("translate(" + d.x + "," + d.y + ")"));
}