export default function(json,vis){
    let _link=vis.selectAll("path.link");
    _link=_link.data(json.links,(d)=>(`${d.source.id}_${d.target.id}`));
    _link.exit().remove();
    _link=_link.enter().append("svg:path").attr("class", "link").merge(_link)
        .attr('stroke-width',(d)=>(d.weight*0.17))
        .attr('id',(d)=>(d.source.index + '_' + d.target.index))
        //不应该有指向自己的关系 异常处理
        .attr('marker-end',(d)=>(d.source.index === d.target.index?false:"url(#arrow)"))
        .attr('stroke','#18a1cf')
        .attr('fill','none');
    return _link;
}
