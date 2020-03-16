use crate::application::Routable;
use crate::domain::os::model::OS;
use rocket::http::Status;
use rocket::Route;
use rocket_contrib::json::Json;

#[get("/cpu")]
pub fn load_average() -> Result<Json<OS>, Status>{
    match OS::load_average() {
        Ok(cpu) => Ok(Json(cpu)),
        Err(_) => Err(Status::ServiceUnavailable),
    }
}

impl Routable for OS {
    const ROUTES: &'static dyn Fn() -> Vec<Route> =
        &|| routes![load_average];
    const PATH: &'static str = "/os/";
}
