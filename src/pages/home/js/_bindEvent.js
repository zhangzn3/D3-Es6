/**
 * Created by Administrator on 2017/6/20.
 */

export default function(json,dialog,update,svg2Png){
    //删除节点和相关联的边
    $('#J_DelNode').off().on('click',()=>{
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
                        update(json)
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
        d.showModal();
    });
    //增加点
    $('#J_AddNode').off().on('click',()=>{
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
                    if(!(json.nodes.findIndex((item)=>($.trim(item.name.toLowerCase())==$.trim(iptNodeName.toLowerCase())))>-1)){
                        json.nodes.push({'name':iptNodeName});
                        update(json)
                    }else{
                        var d = dialog({
                            content: '已经有该节点，重复了！'
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
        d.showModal();
    });
    //添加连接线和关系
    $('#J_AddLR').off().on('click',()=>{
        let dialogTpl=`
             <table class="op-dialog add-link-dialog">
                 <tr>
                     <td class="td-til" >
                      <span>开始点的名称</span>
                     </td>
                     <td>
                       <input type="text" name="node-source-name" class="node-source-name" value="" />
                     </td>
                 </tr>
                  <tr>
                     <td class="td-til" >
                      <span>结束点的名称</span>
                     </td>
                     <td>
                       <input type="text" name="node-target-name" class="node-target-name" value="" />
                     </td>
                 </tr>
                 <tr>
                     <td class="td-til" >
                      <span>连接线的关系</span>
                     </td>
                     <td>
                       <input type="text" name="linetext-name" class="linetext-name" value="" />
                     </td>
                 </tr>
             </table>
            `;
        var d = dialog({
            title: '添加连接线和关系',
            content: dialogTpl,
            okValue: '确定',
            cancelValue: '取消',
            ok: function () {
                let addLinkDialog=$('.add-link-dialog');
                let iptNodeSourceName=addLinkDialog.find('.node-source-name').val();
                let iptNodeTargteName=addLinkDialog.find('.node-target-name').val();
                let iptLineTextName=addLinkDialog.find('.linetext-name').val();
                let hasLinks=json.links.findIndex((item)=>{
                     return item.source.name===iptNodeSourceName&&item.target.name===iptNodeTargteName?false:true
                });
                if(!!iptNodeSourceName&&!!iptNodeTargteName&&!!iptLineTextName){
                    if(hasLinks<=0){
                        let sourceNode=json.nodes.filter((item)=>{
                            return item.name===iptNodeSourceName
                        })[0];
                        let targetNode=json.nodes.filter((item)=>{
                            return item.name===iptNodeTargteName
                        })[0];
                        json.links.push(
                            {
                                "source":sourceNode,
                                "target":targetNode,
                                "relation":iptLineTextName
                            }
                        );
                        update(json)
                    }
                }else{
                    var d = dialog({
                        content: '不能为空！'
                    });
                    d.show();
                    setTimeout(function () {
                        d.close().remove();
                    }, 2000);
                    return false
                }
            },
            cancel: function () {}
        });
        d.showModal();
    });
    //导出png图片
    $('#J_SvgToPng').on('click',()=>{
        svg2Png.saveSvgAsPng(document.getElementById("svgView"), "svg2Png.png")
    });

}
