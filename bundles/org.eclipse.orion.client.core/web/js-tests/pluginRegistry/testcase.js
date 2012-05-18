/*******************************************************************************
 * @license
 * Copyright (c) 2011 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 * 
 * Contributors: IBM Corporation - initial API and implementation
 ******************************************************************************/
/*global define Worker*/


define(["orion/assert", "orion/serviceregistry", "orion/pluginregistry", "orion/Deferred"], function(assert, mServiceregistry, mPluginregistry, Deferred) {
	var tests = {};
	
	tests["test empty registry"] = function() {
		var storage = {};
		var serviceRegistry = new mServiceregistry.ServiceRegistry();
		var pluginRegistry = new mPluginregistry.PluginRegistry(serviceRegistry, storage);
		
		assert.equal(pluginRegistry.getPlugins().length, 0);
		assert.equal(serviceRegistry.getServiceReferences().length, 0);		
	};

	tests["test install plugin"] = function() {
		var storage = {};
		var serviceRegistry = new mServiceregistry.ServiceRegistry();
		var pluginRegistry = new mPluginregistry.PluginRegistry(serviceRegistry, storage);
		
		assert.equal(pluginRegistry.getPlugins().length, 0);
		assert.equal(serviceRegistry.getServiceReferences().length, 0);		
		
		var promise = pluginRegistry.installPlugin("testPlugin.html").then(function(plugin) {
			assert.equal(pluginRegistry.getPlugins().length, 1);
			assert.equal(serviceRegistry.getServiceReferences().length, 1);		
			
			plugin.uninstall();
			
			assert.equal(pluginRegistry.getPlugins().length, 0);
			assert.equal(serviceRegistry.getServiceReferences().length, 0);
			pluginRegistry.shutdown();
		});
		return promise;
	};
	
		tests["test install worker plugin"] = function() {
		if (typeof(Worker) === "undefined") {
			return;
		}
		
		var storage = {};
		var serviceRegistry = new mServiceregistry.ServiceRegistry();
		var pluginRegistry = new mPluginregistry.PluginRegistry(serviceRegistry, storage);
		
		assert.equal(pluginRegistry.getPlugins().length, 0);
		assert.equal(serviceRegistry.getServiceReferences().length, 0);		
		
		var promise = pluginRegistry.installPlugin("testPlugin.js").then(function(plugin) {
			assert.equal(pluginRegistry.getPlugins().length, 1);
			assert.equal(serviceRegistry.getServiceReferences().length, 1);		
			
			plugin.uninstall();
			
			assert.equal(pluginRegistry.getPlugins().length, 0);
			assert.equal(serviceRegistry.getServiceReferences().length, 0);
			pluginRegistry.shutdown();
		});
		return promise;
	};
	
	tests["test reload installed plugin"] = function() {
		var storage = {};
		var serviceRegistry = new mServiceregistry.ServiceRegistry();
		var pluginRegistry = new mPluginregistry.PluginRegistry(serviceRegistry, storage);

		assert.equal(pluginRegistry.getPlugins().length, 0);
		assert.equal(serviceRegistry.getServiceReferences().length, 0);

		var promise = pluginRegistry.installPlugin("testPlugin.html").then(function(plugin) {
			var pluginInfo = {
				location: plugin.getLocation(),
				data: plugin.getData()
			};

			assert.equal(pluginRegistry.getPlugins().length, 1);
			assert.equal(serviceRegistry.getServiceReferences().length, 1);

			plugin.uninstall();

			assert.equal(pluginRegistry.getPlugins().length, 0);
			assert.equal(serviceRegistry.getServiceReferences().length, 0);
			return pluginInfo;
		}).then(function(pluginInfo) {
			return pluginRegistry.installPlugin(pluginInfo.location, pluginInfo.data);
		}).then(function(plugin) {
			assert.equal(pluginRegistry.getPlugins().length, 1);
			assert.equal(serviceRegistry.getServiceReferences().length, 1);

			plugin.uninstall();

			assert.equal(pluginRegistry.getPlugins().length, 0);
			assert.equal(serviceRegistry.getServiceReferences().length, 0);
			pluginRegistry.shutdown();
		});

		return promise;
	};
	
	
	tests["test plugin service call"] = function() {
		var storage = {};
		var serviceRegistry = new mServiceregistry.ServiceRegistry();
		var pluginRegistry = new mPluginregistry.PluginRegistry(serviceRegistry, storage);
		
		assert.equal(pluginRegistry.getPlugins().length, 0);
		assert.equal(serviceRegistry.getServiceReferences().length, 0);		
		
		var promise = pluginRegistry.installPlugin("testPlugin.html").then(function(plugin) {
			return serviceRegistry.getService("test").test("echo");
		}).then(function(result) {
			assert.equal(result, "echo");
			pluginRegistry.shutdown();
		});
		return promise;
	};
	
	tests["test plugin service call promise"] = function() {
		var storage = {};
		var serviceRegistry = new mServiceregistry.ServiceRegistry();
		var pluginRegistry = new mPluginregistry.PluginRegistry(serviceRegistry, storage);
		
		var progress = false;
		
		assert.equal(pluginRegistry.getPlugins().length, 0);
		assert.equal(serviceRegistry.getServiceReferences().length, 0);		
		
		var promise = pluginRegistry.installPlugin("testPlugin.html").then(function(plugin) {
			return serviceRegistry.getService("test").testPromise("echo");
		}).then(function(result) {
			assert.equal(result, "echo");
			assert.ok(progress);
			pluginRegistry.shutdown();
		}, function(error) {
			assert.ok(false);
		}, function (update) {
			assert.equal(update, "progress");
			progress = true;
		});
		return promise;
	};
	
	tests["test plugin event"] = function() {
		var storage = {};
		var serviceRegistry = new mServiceregistry.ServiceRegistry();
		var pluginRegistry = new mPluginregistry.PluginRegistry(serviceRegistry, storage);
		
		assert.equal(pluginRegistry.getPlugins().length, 0);
		assert.equal(serviceRegistry.getServiceReferences().length, 0);
		
		var eventListenerCalls = 0;
		function eventListener(result) {
			if (result === "echotest") {
				eventListenerCalls++;
			}
		}
		
		var promise = pluginRegistry.installPlugin("testPlugin.html").then(function(plugin) {
			var service = serviceRegistry.getService("test");
			service.addEventListener("echo", eventListener);
			return service.testEvent("echo").then(function() {
				service.removeEventListener("echo", eventListener);
				return service.testEvent("echo");
			});
		}).then(function(result) {
			assert.equal(eventListenerCalls, 1);
			pluginRegistry.shutdown();
		});
		return promise;
	};
	
	tests["test pluginregistry event pluginLoading"] = function() {
		var storage = {};
		var serviceRegistry = new mServiceregistry.ServiceRegistry();
		var pluginRegistry = new mPluginregistry.PluginRegistry(serviceRegistry, storage);
		
		assert.equal(pluginRegistry.getPlugins().length, 0);
		assert.equal(serviceRegistry.getServiceReferences().length, 0);		
		
		var promise = new Deferred();
		pluginRegistry.addEventListener("pluginLoading", function(plugin) {
			try {
				assert.ok(!!plugin, "plugin not null");
				assert.equal(plugin.getData().services.length, 1);
				assert.equal(plugin.getData().services[0].properties.name, "echotest");
				promise.resolve();
			} catch(e) {
				promise.reject(e);
			}
		});
		pluginRegistry.installPlugin("testPlugin.html").then(function(plugin) {
			plugin.uninstall();
			pluginRegistry.shutdown();
		});
		return promise;
	};

	// Test ordering guarantee:
	// The testOrdering1() service call injected by our pluginLoading listener should call back before the original 
	// testOrdering2() service call that triggered the listener.
	tests["test pluginregistry event pluginLoading lazy-load service call ordering"] = function() {
		var storage = {};
		var serviceRegistry = new mServiceregistry.ServiceRegistry();
		var pluginRegistry = new mPluginregistry.PluginRegistry(serviceRegistry, storage);

		assert.equal(pluginRegistry.getPlugins().length, 0);
		assert.equal(serviceRegistry.getServiceReferences().length, 0);		

		var listenerCalls = 0;
		pluginRegistry.addEventListener("pluginLoading", function(plugin) {
			assert.equal(++listenerCalls, 1);
			// Our pluginLoading handler invokes testOrdering2 method of the plugin that is loading
			var service = serviceRegistry.getService("testOrdering");
			service.testOrdering1();
		});
		return pluginRegistry.installPlugin("testPlugin2.html").then(function(plugin) {
			var service = serviceRegistry.getService("testOrdering");
			// Kicks off the lazy-load process:
			return service.testOrdering2().then(function() {
				// At this point both the testOrdering1() (injected) and testOrdering2() should've called back.
				return service.getCallOrder().then(function(order) {
					assert.deepEqual(order, ["testOrdering1", "testOrdering2"], "Service method call order is as expected");
					plugin.uninstall();
					pluginRegistry.shutdown();
				});
			});
		});
	};

	tests["test pluginregistry events pluginAdded, pluginRemoved"] = function() {
		var storage = {};
		var serviceRegistry = new mServiceregistry.ServiceRegistry();
		var pluginRegistry = new mPluginregistry.PluginRegistry(serviceRegistry, storage);
		
		assert.equal(pluginRegistry.getPlugins().length, 0);
		assert.equal(serviceRegistry.getServiceReferences().length, 0);		
		
		var promise = new Deferred();
		pluginRegistry.addEventListener("pluginAdded", function(plugin) {
			try {
				assert.ok(!!plugin, "plugin not null");
				assert.equal(plugin.getData().services.length, 1);
				assert.equal(plugin.getData().services[0].properties.name, "echotest");
				promise.resolve();
			} catch(e) {
				promise.reject(e);
			}
		});
		pluginRegistry.installPlugin("testPlugin.html").then(function(plugin) {
			plugin.uninstall();
			pluginRegistry.shutdown();
		});
		return promise;
	};

	tests["test 404 plugin"] = function() {
		var storage = {};
		var serviceRegistry = new mServiceregistry.ServiceRegistry();
		var pluginRegistry = new mPluginregistry.PluginRegistry(serviceRegistry, storage);
		
		var plugins = pluginRegistry.getPlugins();
		assert.equal(plugins.length, 0);
		
		var promise = pluginRegistry.installPlugin("badURLPlugin.html").then(function() {
			throw new assert.AssertionError();
		}, function(e) {
			assert.ok(e.message.match(/Load timeout for plugin/));
			plugins = pluginRegistry.getPlugins();
			assert.equal(plugins.length, 0);
			pluginRegistry.shutdown();
		});
		return promise;
	};

	return tests;
});
