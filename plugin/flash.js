/**
 * Created by ssw on 2014-04-08.
 */
"use strict";
(function(){
    if( Dk.gs( "flash" ) ) return;

    var Info = { name : "Dk garnet plugIn - flash", version : "v0.0.1", contact : "ssw3131@daum.net" },
        Doc = document, _prototype, _dkDtt = Dk.gs( "Detector" ), _dkProto = Dk.gs( "prototype" ), _dkCore = Dk.gs( "core" );

    log( Info ),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // prototype
        (function(){
            var flash, cSl = _dkCore.slice;

            _prototype = function(){
                var self = this, fl = flash, a = arguments, i = a.length, k0 = a[ 0 ];
                i == 1 ? fl[ k0 ].call( self ) : fl[ k0 ].apply( self, cSl.call( a, 1 ) );
                return self;
            },

                // flash
                (function(){
                    var dtt = _dkDtt, addSwf;

                    function checkVersion( $params ){
                        var version;
                        if( $params.version == undefined ) return dtt.flash >= 10.1;
                        else  return version = $params.version, delete $params.version, dtt.flash >= version;
                    }

                    addSwf = ( function(){
                        if( dtt.browser == "ie" && dtt.browserVersion < 9 ){
                            return function(){
                                var self = this, data = self.data, params = data.params, r, k;
                                r = "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' width=" + data.width + " height=" + data.height + " style='position:absolute; margin:0px; padding:0px'>"
                                    + "<param name='movie' value=" + data.url + " />";
                                for( k in params ){
                                    r += "<param name=" + k + " value=" + params[ k ] + " />";
                                }
                                r += "</object>",
                                    self.conElement.innerHTML = r,
                                    self.flash = self.conElement.firstChild;
                            }
                        } else {
                            return function(){
                                var self = this, data = self.data, params = data.params, r, k;
                                r = "<object type='application/x-shockwave-flash' data=" + data.url + " width=" + data.width + " height=" + data.height + " style='position:absolute; margin:0px; padding:0px'>";
                                for( k in params ){
                                    r += "<param name=" + k + " value=" + params[ k ] + " />";
                                }
                                r += "</object>",
                                    self.conElement.innerHTML = r,
                                    self.flash = self.conElement.firstChild;
                            }
                        }
                    }() ),

                        flash = {
                            load : function( $url, $width, $height, $params ){
                                var self = this, data = self.data;
                                data.url = $url, data.width = $width, data.height = $height, data.params = $params = $params || {};
                                if( checkVersion( $params ) )
                                    $params.wmode = $params.wmode || "opaque",
                                        $params.allowScriptAccess = $params.allowScriptAccess || "always",
                                        addSwf.call( self ),
                                        flash.setSize.call( self, $width, $height );
                                else
                                    self.conElement.innerHTML = "<a href='http://www.adobe.com/go/getflashplayer' target'_blank'><img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player'></a>";
                            },

                            setSize : function( $width, $height ){
                                var self = this, data = self.data, s = self.style, cs = self.conStyle, f = self.flash;
                                data.width = s.width = cs.width = f.width = ( typeof $width == "number" ) ? $width + "px" : $width,
                                    data.height = s.height = cs.height = f.height = ( typeof $height == "number" ) ? $height + "px" : $height;
                            },

                            show : function(){
                                this.conStyle.visibility = "visible";
                            },

                            hide : function(){
                                this.conStyle.visibility = "hidden";
                            },

                            refresh : function(){
                                addSwf.call( this );
                            },

                            add : function(){
                                var self = this;
                                self.element.appendChild( self.conElement ), addSwf.call( self );
                            },

                            del : function(){
                                var self = this;
                                self.element.removeChild( self.conElement );
                            },

                            toFlash : function( $func, $params ){
                                this.flash.toFlash( $func, ( $params ) ? $params : [] );
                            }
                        }
                })()
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // flash
        (function(){
            var Flash, Data;

            Flash = function(){
                var self = this, e = Doc.createElement( "div" ), s = e.style, ce = Doc.createElement( "div" ), cs = ce.style;
                self.___eventList = {}, self.parent = null, self.children = [], self.element = e, self.style = s, self.element.___self = self,
                    e.appendChild( ce ), self.conElement = ce, self.conStyle = cs,
                    self.data = new Data();
            },

                // data
                Data = function(){
                    this.url = "", this.width = 0, this.height = 0, this.params = {};
                },

                Flash.prototype = { id : _dkProto.id, pp : _dkProto.pp, atr : _dkProto.atr, css : _dkProto.css, tr : _dkProto.tr, fl : _prototype },

                Dk.gs( "flash", function(){
                    return new Flash();
                } );
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        Dk.plugIn.add( "flash" );
})();