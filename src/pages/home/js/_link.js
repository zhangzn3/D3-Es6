/**
 * Created by Administrator on 2017/5/27.
 */
export default function(json,vis){
    let _link=vis.selectAll("path.link");
    _link=_link.data(json.links,(d)=>(`${d.source.name}_${d.target.name}`));
    _link.exit().remove();
    _link=_link.enter().append("svg:path").attr("class", "link").merge(_link)
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
        .attr('fill','none');
    return _link;
}