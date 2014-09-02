#include "utils.hpp"

int main(int argc, char *argv[])
{
    Engine& engine = Engine::Instance();

    engine.GameLoop();

    return 0;
}
