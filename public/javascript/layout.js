/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Sean Westfall
 * @license MIT
 * @copyright Sean Westfall, 2015
 */

var Engine = famous.core.Engine;
var Surface = famous.core.Surface;
var HeaderFooterLayout = famous.views.HeaderFooterLayout;

var StateModifier = famous.modifiers.StateModifier;
var Modifier = famous.core.Modifier;

var View = famous.core.View;
var Scrollview = famous.views.Scrollview;
var RenderNode = famous.core.RenderNode;

var Transform = famous.core.Transform;
var mainContext = Engine.createContext();

// load content
var contentHtml = $('.content').html();
var headerHtml = $('.header').html();
var naviHtml = $('.navi').html();
var footerHtml = $('.footer').html();
var socialButtons = $('.social').html();

// main layout
var layout = new HeaderFooterLayout();

