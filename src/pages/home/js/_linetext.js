/**
 * Created by Administrator on 2017/6/17.
 */
export default function(json,vis){
    return vis.selectAll('.linetext')
        .data(json.links)
        .enter()
        .append("text")
        .append('svg:textPath')
        .attr("class","linetext")
        .attr("startOffset", "50%")
        .attr("text-anchor", "middle")
        .attr("xlink:href", function(d) {
            if (d.source.index == d.target.index) {
                return false; //不应该有指向自己的关系 异常处理
            } else {
                return "#" + d.source.index + "_" + d.target.index;
            }
        })
        .text(function(d){
            return d.relation;  //关系文字
        })
        .attr('fill','#18a1cf');
}

