{
  pkgs ? import <nixpkgs> { },
}:

pkgs.mkShell {
  packages = with pkgs; [
    corepack_latest
    nodejs_latest
  ];
}
