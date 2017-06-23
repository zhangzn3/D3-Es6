/**
 * Created by Administrator on 2017/6/17.
 */
export default function(highlightObject,tooltip){
    return {
        bindMenuEvent(obj){
            //收起当前节点
            $('.tooltip').off().on('click', '.cm-btn.collapseCurNode',()=>{ highlightObject(obj);})
        },
        highlightToolTip(obj){
            if (obj) {
                tooltip.html("<div class='title'>编辑</div><table class='detail-info'><tr><td><span class='cm-btn collapseCurNode' >收起当前节点</span></td></tr>" +
                        "<tr><td>菜单选项二</td></tr><tr><td>菜单选项三</td></tr></table>")
                    .style("left", (d3.event.pageX + 20) + "px")
                    .style("top", (d3.event.pageY - 20) + "px")
                    .style("opacity", 1.0);
                this.bindMenuEvent(obj);
            } else {
                tooltip.style("opacity", 0.0);
            }
        }
    }
}

