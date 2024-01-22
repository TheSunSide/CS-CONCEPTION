use std::fs;
use rand::Rng;

fn main() {
    let f = fs::read("data/original").unwrap();
    let mut rng = rand::thread_rng();
    let mut key = vec![];
    let mut encrypted_file = vec![];
    for c in f.into_iter() {
        let y: u8 = rng.gen();
        key.push(y);
        encrypted_file.push(c ^ y);
    }
    fs::write("data/key.bin", &key).unwrap();
    fs::write("data/encrypted.bin", &encrypted_file).unwrap();
}
