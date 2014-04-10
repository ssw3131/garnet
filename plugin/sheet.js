/**
 * Created by ssw on 2014-04-09.
 */
(function(){
    if( Dk.gs( "sheet" ) ) return;

    var Info = { name : "Dk garnet plugIn - sprite sheet", version : "v0.0.1", contact : "ssw3131@daum.net" },
        Doc = document, _prototype, _dkProto = Dk.gs( "prototype" ), _dkCore = Dk.gs( "core" );

    trace( Info ),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // prototype
        (function(){
            var sheet, cSl = _dkCore.slice;

            _prototype = function(){
                var self = this, st = sheet, a = arguments, i = a.length, k0 = a[ 0 ];
                i == 1 ? st[ k0 ].call( self ) : st[ k0 ].apply( self, cSl.call( a, 1 ) );
                return self;
            },

                // sprite sheet
                (function(){
                    var list, render, ssId = 0;
                    list = ( render = _dkCore.adManager( start, end ) ).getList(); // add del getList

                    function start(){ Dk.Loop.add( "sheet", update ) }

                    function end(){ Dk.Loop.del( "sheet" ) }

                    function update(){
                        var i = list.length, sheet, data;
                        while( i-- ){
                            sheet = list[ i ].value, data = sheet.data;
                            if( ++data.cr % data.fr < 1 )
                                ++data.cf > data.ef ? data.rp ? data.cf = data.sf : goEnd( sheet ) : null,
                                    goFrame( sheet );
                        }
                    }

                    function goEnd( $sheet ){
                        $sheet.data.cf = $sheet.data.ef,
                            render.del( $sheet.pp( "ssId" ) );
                    }

                    function goFrame( $sheet ){
                        var data = $sheet.data, jArr = data.jArr, x, y;
                        x = jArr[ data.cf - 1 ].frame.x,
                            y = jArr[ data.cf - 1 ].frame.y,
                            $sheet.css( "backgroundPosition", -x + "px " + -y + "px" );
                    }

                    sheet = {
                        load : function( $img, $json, $framerate ){
                            var self = this, data = self.data;
                            self.css( "backgroundImage", "url(" + $img + ")" ),
                                self.pp( "ssId", "ssId" + ++ssId ),
                                Dk.loader.json( $json, loadComplete );

                            function loadComplete( $data ){
                                var jArr = $data.frames;
                                data.jArr = jArr,
                                    data.tf = data.ef = jArr.length,
                                    data.fr = $framerate == undefined ? 60 / 30 : 60 / $framerate,
                                    self.css( "width", jArr[ 0 ].sourceSize.w, "height", jArr[ 0 ].sourceSize.h );
                            }
                        },

                        repeat : function(){
                            var self = this, data = self.data;
                            data.rp = true, data.sf = 1, data.ef = data.tf,
                                render.add( self.pp( "ssId" ), self );
                        },

                        play : function(){
                            var self = this, data = self.data;
                            data.rp = false, data.ef = data.tf,
                                    ++data.cf > data.ef ? data.sf = data.cf = 1 : null,
                                render.add( self.pp( "ssId" ), self );
                        },

                        stop : function(){
                            var self = this;
                            render.del( self.pp( "ssId" ) );
                        },

                        gotoAndStop : function( $frame ){
                            var self = this;
                            self.data.cf = $frame,
                                render.del( self.pp( "ssId" ) ),
                                goFrame( self );
                        },

                        abRepeat : function( $startFrame, $endFrame ){
                            var self = this, data = self.data;
                            data.rp = true, data.sf = data.cf = $startFrame, data.ef = $endFrame,
                                render.add( self.pp( "ssId" ), self );
                        },

                        gotoAndPlay : function( $frame ){
                            var self = this, data = self.data;
                            data.rp = false, data.cf = $frame, data.ef = data.tf,
                                render.add( self.pp( "ssId" ), self );
                        }
                    }
                })()
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // sprite sheet
        (function(){
            var Sheet, Data;

            Sheet = function(){
                var self = this, e = Doc.createElement( "div" ), s = e.style;
                self.___eventList = {}, self.parent = null, self.children = [], self.element = e, self.style = s, self.element.___self = self,
                    self.data = new Data();
            },

                // data
                Data = function(){
                    this.jArr = null, this.rp = true, this.cf = 1, this.tf = 1, this.sf = 1, this.ef = 1, this.cr = 0, this.fr = 30;
                },

                Sheet.prototype = { id : _dkProto.id, pp : _dkProto.pp, atr : _dkProto.atr, css : _dkProto.css, tr : _dkProto.tr, ev : _dkProto.ev, ss : _prototype },

                Dk.gs( "sheet", function(){
                    return new Sheet();
                } );
        })(),
        Dk.plugIn.add();
})();