/**
 * Created by Administrator on 2017/6/3.
 */
import '../../../css/index.css';
import * as d3 from 'd3';
import _vis from './_vis.js';
import _force from './_force.js';
import _link from './_link.js';
import _linetext from './_linetext.js';
import _tick from './_tick.js';
import _tp from './_tp.js';
import _node from './_node.js';
import _nodeDrag from './_nodeDrag.js';
let json=require('../data/data1.json');
let dependsNode=[],dependsLinkAndText=[];
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
const vis=_vis(json);
const force=_force(json);
const link=_link(json,vis);
const linetext=_linetext(json,vis);
const node=_node(json,vis);
const tp=_tp(highlightObject);
const nodeDrag=_nodeDrag(force,_tick,link,node,linetext);
force.on("tick",function(){_tick(link,node,linetext);});


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

tp.tooltip.on('mouseover', function () {
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
    .on('mouseout', function () {
        if (node.node.mouseoutTimeout) {
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




