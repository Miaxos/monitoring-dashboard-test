#![feature(proc_macro_hygiene, decl_macro)]
#[macro_use]
extern crate log;

#[macro_use]
extern crate serde_derive;

#[macro_use]
extern crate rocket;

#[macro_use]
extern crate rocket_contrib;

#[macro_use]
extern crate serde_json;

extern crate dotenv;

extern crate sys_info;

mod application;
mod domain;
mod infrastructure;

use dotenv::dotenv;
use log::LevelFilter;
use std::env;

use infrastructure::logger::ConfigLogger;
use infrastructure::cors::CORS;

use application::*;
use domain::os::model::OS;

fn main() {
    dotenv().ok();

    let log_level = match env::var("RUST_LOG").ok() {
        Some(level) => match level.as_ref() {
            "ERROR" => LevelFilter::Error,
            "WARN" => LevelFilter::Warn,
            "INFO" => LevelFilter::Info,
            "TRACE" => LevelFilter::Trace,
            "DEBUG" => LevelFilter::Debug,
            _ => LevelFilter::Off,
        },
        None => LevelFilter::Off,
    };
    // Start logger
    let _logger = ConfigLogger::init(log_level);
    info!("Starting monitoring-api");
    debug!("Http Server starting");

    /// Path should be an &str that starts with a /
    fn format_api(path: &str) -> String {
        String::from("/api") + path
    }

    // Ignite the rocket server
    rocket::ignite()
        .mount(&format_api(OS::PATH), OS::ROUTES())
        .attach(CORS())
        .launch();
}
