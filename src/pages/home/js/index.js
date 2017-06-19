/**
 * Created by Administrator on 2017/6/3.
 */

import '../../../css/index.css'; //引入全局样式
import * as d3 from 'd3'; //引入D3
import dialog from 'art-dialog';//引入art-dialog
import _vis from './_vis.js'; //引入容器模块
import _force from './_force.js';//引入力导向模块
import _node from './_node.js';//引入节点模块
import _link from './_link.js';//引入连接线模块
import _linetext from './_linetext.js'; //引入关系文字模块
import _tp from './_tp.js';//引入右键菜单模块
import _nodeDrag from './_nodeDrag.js'; //引入节点拖拽模块
import _tick from './_tick.js';//引入更新坐标模块
let json=require('../data/data1.json');//获取数据


//数据源和目标指向更改
json.links.forEach(function (e) {
    if(typeof e.source!="number"&&typeof e.target!="number"){
        var sourceNode = json.nodes.filter(function (n) {
                return n.name === e.source;
            })[0],
            targetNode = json.nodes.filter(function (n) {
                return n.name === e.target;
            })[0];
        e.source = sourceNode;
        e.target = targetNode;
    }
});

//获取各模块返回值
let dependsNode=[],dependsLinkAndText=[];//定义节点数组和连接线&关系文字数组
let vis=_vis(json);
let force=_force(json);
let node=_node(json,vis);
let link=_link(json,vis);
let linetext=_linetext(json,vis);
let tp=_tp(highlightObject);
let nodeDrag=_nodeDrag(force,_tick,link,node,linetext);

//更新坐标函数
force.on("tick",function(){
    _tick(link,linetext,node)
});

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
                //删除节点
                nodeIndex>-1&& json.nodes.splice(nodeIndex,1); node.data(json.nodes,(d)=>(d.name)).exit().remove();
                //删除节点相关联的边
                for (let i = 0; i < json.links.length; i++) {
                    if (nodeIndex == json.links[i]['source']['index'] || nodeIndex == json.links[i]['target']['index']) {
                        json.links.splice(i, 1);
                        i--;
                    }
                }
                link.data(json.links,(d)=>(`${d.source.name}_${d.target.name}`)).exit().remove();
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

            }
        },
        cancel: function () {}
    });
    d.show();
});

function highlightObject(obj){
    if (obj) {
        var objIndex= obj.index;
        dependsNode=dependsNode.concat([objIndex]);
        dependsLinkAndText=dependsLinkAndText.concat([objIndex]);
        node.classed('inactive',function(d){
            return (dependsNode.indexOf(d.index) > -1)
        });
        link.classed('inactive', function(d) {
            return ((dependsLinkAndText.indexOf(d.source.index) > -1) || (dependsLinkAndText.indexOf(d.target.index) > -1))
        });
        linetext.classed('inactive',function(d){
            return ((dependsLinkAndText.indexOf(d.source.index) > -1) || (dependsLinkAndText.indexOf(d.target.index) > -1))
        });
    } else {
        node.classed('inactive', false);
        link.classed('inactive', false);
        linetext.classed('inactive', false);
    }
}

tp.tooltip.on('dblclick', function () {
        d3.event.stopPropagation();
    })
    .on('mouseover', function () {
        if (node.mouseoutTimeout) {
            clearTimeout(node.mouseoutTimeout);
            node.mouseoutTimeout = null;
        }
    })
    .on('mouseout', function () {
        if (node.mouseoutTimeout) {
            clearTimeout(node.mouseoutTimeout);
            node.mouseoutTimeout = null;
        }
        node.mouseoutTimeout = setTimeout(function () {
            tp.highlightToolTip(null);
        }, 300);
    });

node.on('contextmenu', function (d) {
        if (node.mouseoutTimeout) {
            clearTimeout(node.mouseoutTimeout);
            node.mouseoutTimeout = null;
        }
        tp.highlightToolTip(d);
        d3.event.preventDefault();
        d3.event.stopPropagation();
    })
    .on('mouseover', function(d) {
        if (node.mouseoutTimeout) {
            clearTimeout(node.mouseoutTimeout);
            node.mouseoutTimeout = null;
        }
    })
    .on('mouseout', function () {
        if (node.mouseoutTimeout) {
            clearTimeout(node.mouseoutTimeout);
            node.mouseoutTimeout = null;
        }
        node.mouseoutTimeout = setTimeout(function () {
            tp.highlightToolTip(null);
        }, 300);
    })
    .call(nodeDrag);

d3.select("body").on('dblclick', function () {
    dependsNode = dependsLinkAndText = [];
    highlightObject(null);
    force.restart();
});




