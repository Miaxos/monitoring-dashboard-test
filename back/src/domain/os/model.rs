use sys_info::{loadavg, cpu_num};

/// Struct that represent the Computer
#[derive(Serialize, Deserialize)]
pub struct OS {
    cpu_load: f64,
}

impl OS {
    pub fn load_average() -> Result<OS, String> {
        let cpu_request = cpu_num();

        if cfg!(windows) {
            return Err("Load average not available for windows".to_string());
        }

        match (cpu_request, loadavg()) {
            (Ok(cpu), Ok(load)) => {
                info!("\nCPU load average: {:?} | Number of CPU: {:?}", load, cpu);
                Ok(OS { cpu_load: load.one / f64::from(cpu) })
            },
            (Err(error), _) => {
                error!("\nCPU number: error: {}", error);
                Err("CPU number error".to_string())
            }

            (_, Err(error)) => {
                error!("\nCPU load: error: {}", error);
                Err("CPU Load error".to_string())
            }
        }
    }
}
