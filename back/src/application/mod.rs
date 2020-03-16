use rocket::Route;

pub mod os;

/// Convienence trait that specifies that implementors must package up their routes into a vector
/// and a path so that consumption by Rocket's mount() function is painless.
/// Every route that should be mounted in rocket must be specified in ROUTES.
/// The PATH is used to format the path, inserting an `/api` before it to distinguish it from other possible paths.
pub trait Routable {
    const ROUTES: &'static dyn Fn() -> Vec<Route>;
    const PATH: &'static str;
}
