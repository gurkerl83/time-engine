/* written in ECMAscript 6 */
/**
 * @fileoverview WAVE audio time engine base class
 * @author Norbert.Schnell@ircam.fr, Victor.Saiz@ircam.fr, Karim.Barkati@ircam.fr
 */
"use strict";

var audioContext = require("audio-context");

/**
 * @class TimeEngine
 * @classdesc Base class for time engines
 *
 * Time engines are components that generate more or less regular audio events and/or playback a media stream.
 * They implement one or multiple imterfaces to be synchronized by a master such as a scheduler, a transport or a play-control.
 * The provided interfaces are "scheduled", "transported", and "play-controlled".
 *
 * In the "scheduled" interface the engine implements a method "advanceTime" that is called by the master (usually teh scheduler)
 * and returns the delay until the next call of "advanceTime". The master provides the engien with a function "resetNextTime"
 * to reschedule the next call to another time.
 *
 * In the "transported" interface the master (usually a transport) first calls the method "syncPosition" that returns the position
 * of the first event generated by the engine regarding the playing direction (sign of the speed argument). Events are generated
 * through the method "advancePosition" that returns the position of the next event generated through "advancePosition".
 *
 * In the "speed-controlled" interface the engine is controlled by the method "syncSpeed".
 *
 * For all interfaces the engine is provided with the attribute getters "currentTime" and "currentPosition" (for the case that the master
 * does not implement these attributte getters, the base class provides default implementations).
 */
var TimeEngine = (function(){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var DPS$0 = Object.defineProperties;var proto$0={};

  /**
   * @constructor
   */
  function TimeEngine() {

    /**
     * Interface currently used
     * @type {String}
     */
    this.interface = null;

    /**
     * Output audio node
     * @type {Object}
     */
    this.outputNode = null;
  }DPS$0(TimeEngine.prototype,{currentTime: {"get": $currentTime_get$0, "configurable":true,"enumerable":true}, currentPosition: {"get": $currentPosition_get$0, "configurable":true,"enumerable":true}});DP$0(TimeEngine,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  /**
   * Get the time engine's current master time
   * @type {Function}
   *
   * This function provided by the master.
   */
  function $currentTime_get$0() {
    return audioContext.currentTime;
  }

  /**
   * Get the time engine's current master position
   * @type {Function}
   *
   * This function provided by the master.
   */
  function $currentPosition_get$0() {
    return 0;
  }

  /**
   * Advance engine time (scheduled interface)
   * @param {Number} time current scheduler time (based on audio time)
   * @return {Number} next engine time
   *
   * This function is called by the scheduler to let the engine do its work
   * synchronized to the scheduler time.
   * If the engine returns Infinity, it is not called again until it is restarted by
   * the scheduler or it calls resetNextPosition with a valid position.
   */
  // advanceTime(time) {
  //   return time;
  // }

  /**
   * Function provided by the scheduler to reset the engine's next time
   * @param {Number} time new engine time (immediately if not specified)
   */
  proto$0.resetNextTime = function() {var time = arguments[0];if(time === void 0)time = null;};

  /**
   * Synchronize engine to transport position (transported interface)
   * @param {Number} position current transport position to synchronize to
   * @param {Number} time current scheduler time (based on audio time)
   * @param {Number} speed current speed
   * @return {Number} next position (given the playing direction)
   *
   * This function is called by the msater and allows the engine for synchronizing
   * (seeking) to the current transport position and to return its next position.
   * If the engine returns Infinity or -Infinity, it is not called again until it is
   * resynchronized by the transport or it calls resetNextPosition.
   */
  // syncPosition(time, position, speed) {
  //   return position;
  // }

  /**
   * Advance engine position (transported interface)
   * @param {Number} time current scheduler time (based on audio time)
   * @param {Number} position current transport position
   * @param {Number} speed current speed
   * @return {Number} next engine position (given the playing direction)
   *
   * This function is called by the transport to let the engine do its work
   * aligned to the transport's position.
   * If the engine returns Infinity or -Infinity, it is not called again until it is
   * resynchronized by the transport or it calls resetNextPosition.
   */
  // advancePosition(time, position, speed) {
  //   return position;
  // }

  /**
   * Function provided by the transport to reset the next position or to request resynchronizing the engine's position
   * @param {Number} position new engine position (will call syncPosition with the current position if not specified)
   */
  proto$0.resetNextPosition = function() {var position = arguments[0];if(position === void 0)position = null;};

  /**
   * Set engine speed (speed-controlled interface)
   * @param {Number} time current scheduler time (based on audio time)
   * @param {Number} speed current transport speed
   *
   * This function is called by the transport to propagate the transport speed to the engine.
   * The speed can be of any value bewteen -16 and 16.
   * With a speed of 0 the engine is halted.
   */
  // syncSpeed(time, speed) {
  // }

  proto$0.__setGetters = function(getCurrentTime, getCurrentPosition) {
    if (getCurrentTime) {
      Object.defineProperty(this, 'currentTime', {
        configurable: true,
        get: getCurrentTime,
        set: function(time) {}
      });
    }

    if (getCurrentPosition) {
      Object.defineProperty(this, 'currentPosition', {
        configurable: true,
        get: getCurrentPosition,
        set: function(position) {}
      });
    }
  };

  proto$0.__deleteGetters = function() {
    delete this.currentTime;
    delete this.currentPosition;
  };

  /**
   * Connect audio node
   * @param {Object} target audio node
   */
  proto$0.connect = function(target) {
    this.outputNode.connect(target);
    return this;
  };

  /**
   * Disconnect audio node
   * @param {Number} connection connection to be disconnected
   */
  proto$0.disconnect = function(connection) {
    this.outputNode.disconnect(connection);
    return this;
  };
MIXIN$0(TimeEngine.prototype,proto$0);proto$0=void 0;return TimeEngine;})();

/**
 * Check whether the time engine implements the scheduled interface
 **/
TimeEngine.implementsScheduled = function(engine) {
  return (engine.advanceTime && engine.advanceTime instanceof Function);
};

/**
 * Check whether the time engine implements the transported interface
 **/
TimeEngine.implementsTransported = function(engine) {
  return (
    engine.syncPosition && engine.syncPosition instanceof Function &&
    engine.advancePosition && engine.advancePosition instanceof Function
  );
};

/**
 * Check whether the time engine implements the speed-controlled interface
 **/
TimeEngine.implementsSpeedControlled = function(engine) {
  return (engine.syncSpeed && engine.syncSpeed instanceof Function);
};

TimeEngine.setScheduled = function(engine, resetNextTime, getCurrentTime, getCurrentPosition) {
  engine.interface = "scheduled";
  engine.__setGetters(getCurrentTime, getCurrentPosition);
  if (resetNextTime)
    engine.resetNextTime = resetNextTime;
};

TimeEngine.setTransported = function(engine, resetNextPosition, getCurrentTime, getCurrentPosition) {
  engine.interface = "transported";
  engine.__setGetters(getCurrentTime, getCurrentPosition);
  if (resetNextPosition)
    engine.resetNextPosition = resetNextPosition;
};

TimeEngine.setSpeedControlled = function(engine, getCurrentTime, getCurrentPosition) {
  engine.interface = "speed-controlled";
  engine.__setGetters(getCurrentTime, getCurrentPosition);
};

TimeEngine.resetInterface = function(engine) {
  engine.__deleteGetters();
  delete engine.resetNextTime;
  delete engine.resetNextPosition;
  engine.interface = null;
};

module.exports = TimeEngine;