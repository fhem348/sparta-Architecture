router.post("/sign-up", async (req, res, next) => {
  try {
    const {
      email,
      password,
      passwordConfirm,
      name,
      age,
      gender,
      profileImage,
    } = req.body;

    const isExistUser = await prisma.users.findFirst({
      where: { email },
    });

    if (isExistUser) {
      return res
        .status(409)
        .json({ errorMessage: "이미 존재하는 이메일입니다." });
    }

    if (password !== passwordConfirm) {
      return res
        .status(400)
        .json({ errorMessage: "패스워드 확인이 일치하지 않습니다. " });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await prisma.$transaction(
      async (tx) => {
        const user = await tx.users.create({
          data: {
            email,
            password: hashedPassword,
            name,
            age,
            gender,
            profileImage,
          },
        });
        return [user];
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );

    return res.status(201).json({ message: "회원가입이 완료되었습니다" });
  } catch (err) {
    next(err);
  }
});

router.delete("/sign-out", authMiddleWare, async (req, res, next) => {
  try {
    const { password } = req.body;

    const user = req.user;

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ errorMessage: "비밀번호가 일치하지 않습니다." });
    }

    await prisma.users.delete({
      where: { email: user.email },
    });

    return res.status(200).json({ message: "회원 탈퇴가 완료되었습니다." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errorMessage: "서버 에러가 발생했습니다." });
  }
});

export default router;
