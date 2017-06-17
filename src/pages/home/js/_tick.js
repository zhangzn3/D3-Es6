const arcPath=function(leftHand, d) {
    let start = leftHand ? d.source : d.target,
        end = leftHand ? d.target : d.source,
        dx = end.x - start.x,
        dy = end.y - start.y,
        dr = Math.sqrt(dx * dx + dy * dy),
        sweep = leftHand ? 0 : 1;
    return "M" + start.x + "," + start.y + "A" + dr + "," + dr +
        " 0 0," + sweep + " " + end.x + "," + end.y;
};
export default function tick(link,node,linetext){
        link.attr("d",(d)=>(arcPath(false, d)));
        //关系文字显示的位置
        linetext.attr("d",(d)=>(arcPath(d.source.x < d.target.x, d)));
        node.attr("transform",(d)=>("translate(" + d.x + "," + d.y + ")"));
}