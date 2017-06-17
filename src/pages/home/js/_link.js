/**
 * Created by Administrator on 2017/5/27.
 */

export default function(json,vis){
    return vis.selectAll("line.link")
        .data(json.links)
        .enter().append("svg:path")
        .attr("class", "link")
        .attr('stroke-width',1)
        .attr('id', function (d) {
            return d.source.index + '_' + d.target.index
        })
        .attr('marker-end', function (d) {
            if (d.source.index == d.target.index) {
                return false; //不应该有指向自己的关系 异常处理
            } else {
                return "url(#arrow)"
            }
        })
        .attr('stroke','#18a1cf')
        .attr('fill','none')
}