// import { CommonService } from "@/services/routes/api/common/test";

export function CommonPage() {
  // async function testCommonPermision() {
  //   await CommonService.test()
  //     .then(() => {
  //       alert("TIENES PERMISOS");
  //     })
  //     .catch(() => {
  //       alert("NO TIENES PERMISOS");
  //     });
  // }

  return (
    <div>
      <div>CommonPage</div>
      <button
      // onClick={testCommonPermision}
      >
        Test Common Permission
      </button>
    </div>
  );
}
