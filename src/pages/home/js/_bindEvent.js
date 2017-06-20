/**
 * Created by Administrator on 2017/6/20.
 */

export default function(json,dialog,update){
    //删除节点和相关联的边
    $(document).on('click','#J_DelNode',function(){
        let dialogTpl=`
                     <table class="op-dialog del-node-dialog">
                         <tr>
                             <td class="td-til" >
                              <span>输入节点名称</span>
                             </td>
                             <td>
                               <input type="text" name="node-name" class="node-name" value="" />
                             </td>
                         </tr>
                     </table>
                    `;
        var d = dialog({
            title: '删除节点和关联的边',
            content: dialogTpl,
            okValue: '确定',
            cancelValue: '取消',
            ok: function () {
                let iptNodeName=$('.del-node-dialog').find('.node-name').val();
                if(!!iptNodeName){
                    //获取节点索引
                    let nodeIndex=json.nodes.findIndex((item)=>(item.name===iptNodeName));
                    if(nodeIndex>-1){
                        //删除节点
                        json.nodes.splice(nodeIndex,1);
                        //删除节点相关联的边
                        for (let i = 0; i < json.links.length; i++) {
                            if (nodeIndex == json.links[i]['source']['index'] || nodeIndex == json.links[i]['target']['index']) {
                                json.links.splice(i, 1);
                                i--;
                            }
                        }
                        update();
                    }else{
                        var d = dialog({
                            content: '没有查找到该节点！'
                        });
                        d.show();
                        setTimeout(function () {
                            d.close().remove();
                        }, 2000);
                    }
                }
            },
            cancel: function () {}
        });
        d.show();
    });
    //增加点和边
    $(document).on('click','#J_AddNode',function(){
        let dialogTpl=`
             <table class="op-dialog add-node-dialog">
                 <tr>
                     <td class="td-til" >
                      <span>输入节点名称</span>
                     </td>
                     <td>
                       <input type="text" name="node-name" class="node-name" value="" />
                     </td>
                 </tr>
             </table>
            `;
        var d = dialog({
            title: '添加点',
            content: dialogTpl,
            okValue: '确定',
            cancelValue: '取消',
            ok: function () {
                let iptNodeName=$('.add-node-dialog').find('.node-name').val();
                if(!!iptNodeName){
                    json.nodes.push({'name':iptNodeName});
                    update();
                }
            },
            cancel: function () {}
        });
        d.show();
    });
}
