export default function(json,vis){
     let _linetext=vis.selectAll('.linetext');
     _linetext=_linetext.data(json.links,(d)=>(`${d.source.name}_${d.target.name}`));
     _linetext.exit().remove();
     _linetext=_linetext.enter().append("text").attr("class","linetext").merge(_linetext);
     _linetext.selectAll('textPath').remove();
     _linetext.append('svg:textPath').attr("startOffset", "50%")
     .attr("text-anchor", "middle")
     .attr("xlink:href", (d)=>{ //不应该有指向自己的关系 异常处理
     return d.source.index === d.target.index?false:`#${d.source.index}_${d.target.index}`})
     .text((d)=>(d.relation))//关系文字
     .attr('fill','#18a1cf');
     return _linetext;
}

