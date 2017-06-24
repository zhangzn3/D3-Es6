/**
 * Created by Administrator on 2017/6/17.
 */
export default function(highlightObject,tooltip){
    return {
        bindMenuEvent(obj){
            $('.tooltip').off().on('click', '.cm-btn.collapseCurNode',()=>{ highlightObject(obj);})
        },
        highlightToolTip(obj){
            let toolTpl=`
                <div class='title'>编辑</div>
                <table class='detail-info'>
                    <tr><td><span class='cm-btn collapseCurNode' >收起当前节点</span></td></tr>
                    <tr><td>菜单选项二</td></tr><tr><td>菜单选项三</td></tr>
                </table>
            `;
            if (obj) {
                tooltip.html(toolTpl).style("left",`${d3.event.pageX}px`).style("top",`${d3.event.pageY}px`).style("display","block");
                this.bindMenuEvent(obj);
            } else {
                tooltip.style("display",'none');
            }
        }
    }
}

