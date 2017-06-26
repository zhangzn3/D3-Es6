export default function(json,dialog,update,svg2Png){
    //删除节点和相关联的边
    d3.select('#J_DelNode').on('click',()=>{
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
        let d = dialog({
            title: '删除节点和关联的边',
            content: dialogTpl,
            okValue: '确定',
            cancelValue: '取消',
            ok() {
                let iptNodeName=$.trim($('.del-node-dialog').find('.node-name').val().toLowerCase());
                if(!!iptNodeName){
                    //获取节点索引
                    let nodeIndex=json.nodes.findIndex((item)=>(item.name.toLowerCase()===iptNodeName));
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
                        let d = dialog({content: '没有查找到该节点！'}).show();
                        setTimeout(()=>{d.close().remove()}, 2000);
                        return false;
                    }
                }
            },
            cancel(){}
        }).showModal();
    });
    //增加点
    d3.select('#J_AddNode').on('click',()=>{
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
        let d = dialog({
            title: '添加点',
            content: dialogTpl,
            okValue: '确定',
            cancelValue: '取消',
            ok() {
                let iptNodeName=$('.add-node-dialog').find('.node-name').val();
                if(!!iptNodeName){
                    if(!(json.nodes.findIndex((item)=>(item.name.toLowerCase()==$.trim(iptNodeName.toLowerCase())))>-1)){
                        json.nodes.push({'name':iptNodeName});
                        update(json)
                    }else{
                        let d = dialog({content: '已经有该节点，重复了！'}).show();
                        setTimeout(()=>{d.close().remove()}, 2000);
                        return false;
                    }
                }
            },
            cancel(){}
        }).showModal();
    });
    //添加连接线和关系
    d3.select('#J_AddLR').on('click',()=>{
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

        let d = dialog({
            title: '添加连接线和关系',
            content: dialogTpl,
            okValue: '确定',
            cancelValue: '取消',
            ok() {
                let addLinkDialog=$('.add-link-dialog');
                let iptNodeSourceName=addLinkDialog.find('.node-source-name').val();
                let iptNodeTargteName=addLinkDialog.find('.node-target-name').val();
                let iptLineTextName=addLinkDialog.find('.linetext-name').val();
                let alreadyLinking=json.links.findIndex((item)=>{
                     return item.source.name===iptNodeSourceName&&item.target.name===iptNodeTargteName
                });
                function hasNodes(key){
                    return json.nodes.findIndex((item)=>{
                        return item.name===key
                    })
                }
                if(!!iptNodeSourceName&&!!iptNodeTargteName&&!!iptLineTextName){
                    if(alreadyLinking<0&&hasNodes(iptNodeSourceName)>-1&& hasNodes(iptNodeTargteName)>-1){
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
                                "value":iptLineTextName
                            }
                        );
                        update(json)
                    }else{
                        let d = dialog({content: '已经有连线或者没有这些节点!'}).show();
                        setTimeout(()=>{d.close().remove()}, 2000);
                        return false
                    }
                }else{
                    let d = dialog({content: '不能为空!'}).show();
                    setTimeout(()=>{d.close().remove()}, 2000);
                    return false
                }
            },
            cancel(){}
        }).showModal();
    });
    //导出png图片
    d3.select('#J_SvgToPng').on('click',()=>{
        svg2Png.saveSvgAsPng(document.getElementById("svgView"), "svg2Png.png")
    });
    //
}
