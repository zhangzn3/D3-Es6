export default function(highlightObject,tooltip,dialog,json,update){
    return {
        bindMenuEvent(obj){
            d3.select('.tooltip .cm-btn.collapseCurNode').on('click',()=>{ highlightObject(obj)});
            d3.select('.tooltip .cm-btn.editCurrentNode').on('click',()=>{this.editCurrentNode(obj)})
        },
        highlightToolTip(obj){//右键菜单
            let toolTpl=`
                <div class='title'>编辑</div>
                <table class='detail-info'>
                    <tr><td><span class='cm-btn collapseCurNode' >收起当前节点</span></td></tr>
                    <tr><td><span class='cm-btn editCurrentNode' >编辑当前节点</span></td></tr>
                    <tr><td>菜单选项三</td></tr>
                </table>
            `;
            if (obj) {
                tooltip.html(toolTpl).style("left",`${d3.event.pageX}px`).style("top",`${d3.event.pageY}px`).style("display","block");
                this.bindMenuEvent(obj);
            } else {
                tooltip.style("display",'none');
            }
        },
        editCurrentNode:function(obj){//编辑节点属性
            let dialogTpl=`
             <table class="op-dialog edit-node-dialog">
                 <tr>
                     <td class="td-til" >
                      <span>节点名称</span>
                     </td>
                     <td>
                       <input type="text" name="node-name" class="node-name" value=${obj.name} readonly />
                     </td>
                 </tr>
                 <tr>
                     <td class="td-til" >
                      <span>节点属性</span>
                     </td>
                     <td>
                       <input type="text" name="node-name" class="node-group" value=${obj.group} />
                     </td>
                 </tr>
             </table>
            `;
            let d = dialog({
                title: '编辑当前节点',
                content: dialogTpl,
                okValue: '确定',
                cancelValue: '取消',
                ok() {
                    let iptNodeGroup=$('.edit-node-dialog').find('.node-group').val();
                    if(!!iptNodeGroup){
                        json.nodes.forEach((item)=>{
                            item.name==obj.name&&(item.group=iptNodeGroup)
                        });
                        update(json)
                    }
                },
                cancel(){}
            }).showModal();
        }
    }
}

