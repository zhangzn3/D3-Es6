export default function(json,vis){
    let _link=vis.selectAll("path.link");
    _link=_link.data(json.links,(d)=>(`${d.source.name}_${d.target.name}`));
    _link.exit().remove();
    _link=_link.enter().append("svg:path").attr("class", "link").merge(_link)
        .attr('stroke-width',(d)=>{ //只有一个字段，暂时这样写
            let value=(d.value+"").match(/^\d+$/);
            return !!value?(value[0]*0.27<1?1:value[0]*0.27):1
        })
        .attr('id',(d)=>(d.source.index + '_' + d.target.index))
        //不应该有指向自己的关系 异常处理
        .attr('marker-end',(d)=>(d.source.index === d.target.index?false:"url(#arrow)"))
        .attr('stroke','#18a1cf')
        .attr('fill','none');
    return _link;
}
